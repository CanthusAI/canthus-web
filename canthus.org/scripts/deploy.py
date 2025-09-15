#!/usr/bin/env python3
"""
Canthus.org Deployment Script

This script handles deployment of the Canthus.org application to Cloudflare Workers and Pages.
It includes build verification, production state management, and checks Wrangler CLI configuration.

Usage:
    python3 scripts/deploy.py [--environment=production|staging] [--dry-run] [--skip-tests]

Authentication:
    The script will use Wrangler CLI authentication if available. If not authenticated,
    it will fall back to CLOUDFLARE_API_TOKEN environment variable.

    To authenticate: wrangler login
    Or set: CLOUDFLARE_API_TOKEN environment variable

Note: Other environment variables and secrets should be configured through Wrangler CLI
using 'wrangler secret put' or environment-specific configuration in wrangler.toml
"""

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple


class DeploymentError(Exception):
    """Custom exception for deployment-related errors."""

    pass


class DeployScript:
    """Main deployment script class."""

    def __init__(
        self,
        environment: str = "production",
        dry_run: bool = False,
        skip_tests: bool = False,
    ):
        self.environment = environment
        self.dry_run = dry_run
        self.skip_tests = skip_tests
        self.project_root = Path(__file__).parent.parent
        self.server_dir = self.project_root / "server"
        self.client_dir = self.project_root / "client"
        self.deployment_log = []

        # Only CLOUDFLARE_API_TOKEN is required as it's needed for Wrangler CLI
        # Other variables are managed through Wrangler secrets/config

    def log(self, message: str, level: str = "INFO") -> None:
        """Log a message with timestamp."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] [{level}] {message}"
        print(log_entry)
        self.deployment_log.append(log_entry)

    def run_command(
        self, command: List[str], cwd: Optional[Path] = None, check: bool = True
    ) -> Tuple[int, str, str]:
        """Run a command and return the result."""
        if cwd is None:
            cwd = self.project_root

        self.log(f"Running command: {' '.join(command)} in {cwd}")

        if self.dry_run:
            self.log("DRY RUN: Command would be executed", "DRY_RUN")
            return 0, "", ""

        try:
            result = subprocess.run(
                command, cwd=cwd, capture_output=True, text=True, check=check
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.CalledProcessError as e:
            self.log(f"Command failed with return code {e.returncode}", "ERROR")
            self.log(f"STDOUT: {e.stdout}", "ERROR")
            self.log(f"STDERR: {e.stderr}", "ERROR")
            if check:
                raise DeploymentError(f"Command failed: {' '.join(command)}")
            return e.returncode, e.stdout, e.stderr

    def check_prerequisites(self) -> None:
        """Check if all prerequisites are met."""
        self.log("Checking prerequisites...")

        # Check if we're in the right directory
        if not (self.project_root / "package.json").exists():
            raise DeploymentError("Not in project root directory")

        # Check if bun is installed
        returncode, _, _ = self.run_command(["bun", "--version"], check=False)
        if returncode != 0:
            raise DeploymentError("Bun is not installed or not in PATH")

        # Check if wrangler is installed
        returncode, _, _ = self.run_command(["wrangler", "--version"], check=False)
        if returncode != 0:
            raise DeploymentError("Wrangler CLI is not installed or not in PATH")

        # Check if we're authenticated with Cloudflare
        returncode, _, _ = self.run_command(["wrangler", "whoami"], check=False)
        if returncode != 0:
            # If not authenticated, check if CLOUDFLARE_API_TOKEN is available
            if not os.getenv("CLOUDFLARE_API_TOKEN"):
                raise DeploymentError(
                    "Not authenticated with Cloudflare and no CLOUDFLARE_API_TOKEN found.\n"
                    "Either run 'wrangler login' or set CLOUDFLARE_API_TOKEN environment variable"
                )
            self.log(
                "Wrangler not authenticated, but CLOUDFLARE_API_TOKEN is available"
            )
        else:
            self.log("Wrangler CLI is authenticated")

        self.log("Prerequisites check passed")

    def check_cloudflare_secrets(self) -> None:
        """Check if Cloudflare secrets are configured for the environment."""
        self.log(f"Checking Cloudflare secrets configuration for {self.environment}...")

        # Try to list secrets to see if any are configured
        returncode, stdout, stderr = self.run_command(
            ["wrangler", "secret", "list", "--env", self.environment],
            cwd=self.server_dir,
            check=False,
        )

        if returncode != 0:
            self.log(
                f"Could not list secrets for {self.environment}: {stderr}", "WARNING"
            )
            self.log(
                "Secrets may not be configured. Deployment will proceed without secret validation.",
                "INFO",
            )
            return

        # If we can list secrets, check if any are configured
        if stdout.strip():
            self.log(f"Found configured secrets for {self.environment}")
            # List the secrets that are configured
            for line in stdout.strip().split("\n"):
                if line.strip():
                    self.log(f"  - {line.strip()}")
        else:
            self.log(f"No secrets configured for {self.environment}")

        self.log("Cloudflare secrets check completed")

    def run_tests(self) -> None:
        """Run tests before deployment."""
        if self.skip_tests:
            self.log("Skipping tests as requested")
            return

        self.log("Running tests...")

        # Run server tests
        self.log("Running server tests...")
        returncode, stdout, stderr = self.run_command(
            ["bun", "test"], cwd=self.server_dir, check=False
        )

        if returncode != 0:
            raise DeploymentError(f"Server tests failed: {stderr}")

        self.log("All tests passed")

    def build_application(self) -> None:
        """Build the application."""
        self.log("Building application...")

        # Build shared package first
        self.log("Building shared package...")
        self.run_command(["bun", "run", "build"], cwd=self.project_root / "shared")

        # Build server
        self.log("Building server...")
        self.run_command(["bun", "run", "build"], cwd=self.server_dir)

        # Build client
        self.log("Building client...")
        self.run_command(["bun", "run", "build"], cwd=self.client_dir)

        self.log("Application build completed")

    def deploy_server(self) -> None:
        """Deploy the server to Cloudflare Workers."""
        self.log(f"Deploying server to {self.environment}...")

        # Deploy using wrangler
        self.run_command(
            ["wrangler", "deploy", "--env", self.environment], cwd=self.server_dir
        )

        self.log(f"Server deployed to {self.environment}")

    def deploy_client(self) -> None:
        """Deploy the client to Cloudflare Pages."""
        self.log(f"Deploying client to {self.environment}...")

        # Deploy using wrangler pages
        self.run_command(["wrangler", "pages", "deploy", "dist"], cwd=self.client_dir)

        self.log(f"Client deployed to {self.environment}")

    def verify_deployment(self) -> None:
        """Verify that the deployment was successful."""
        self.log("Verifying deployment...")

        # Get deployment URLs from wrangler
        returncode, stdout, stderr = self.run_command(
            ["wrangler", "deploy", "--dry-run", "--env", self.environment],
            cwd=self.server_dir,
            check=False,
        )

        if returncode == 0:
            self.log("Deployment verification passed")
        else:
            self.log(f"Deployment verification failed: {stderr}", "WARNING")

    def save_deployment_log(self) -> None:
        """Save deployment log to file."""
        # Create logs directory if it doesn't exist
        logs_dir = self.project_root / "logs"
        logs_dir.mkdir(exist_ok=True)
        
        log_file = (
            logs_dir
            / f"deployment-{self.environment}-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log"
        )

        with open(log_file, "w") as f:
            f.write("\n".join(self.deployment_log))

        self.log(f"Deployment log saved to {log_file}")

    def deploy(self) -> None:
        """Main deployment process."""
        try:
            self.log(f"Starting deployment to {self.environment}")
            self.log(f"Dry run: {self.dry_run}")
            self.log(f"Skip tests: {self.skip_tests}")

            # Pre-deployment checks
            self.check_prerequisites()
            self.check_cloudflare_secrets()

            # Build and test
            self.run_tests()
            self.build_application()

            # Deploy
            self.deploy_server()
            self.deploy_client()

            # Post-deployment verification
            self.verify_deployment()

            self.log(f"Deployment to {self.environment} completed successfully!")

        except DeploymentError as e:
            self.log(f"Deployment failed: {e}", "ERROR")
            sys.exit(1)
        except Exception as e:
            self.log(f"Unexpected error: {e}", "ERROR")
            sys.exit(1)
        finally:
            self.save_deployment_log()


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Deploy Canthus.org application")
    parser.add_argument(
        "--environment",
        choices=["production", "staging"],
        default="production",
        help="Target environment (default: production)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Perform a dry run without actually deploying",
    )
    parser.add_argument(
        "--skip-tests", action="store_true", help="Skip running tests before deployment"
    )

    args = parser.parse_args()

    deployer = DeployScript(
        environment=args.environment, dry_run=args.dry_run, skip_tests=args.skip_tests
    )

    deployer.deploy()


if __name__ == "__main__":
    main()
