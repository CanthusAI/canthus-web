# Deployment Scripts

This directory contains deployment scripts for the Canthus.org application.

## deploy.py

A comprehensive Python deployment script that handles deployment to Cloudflare Workers and Pages with proper environment validation, testing, and state management.

### Features

- **Environment Validation**: Validates all required environment variables before deployment
- **Build Verification**: Runs tests and builds all packages before deployment
- **Production State Management**: Maintains deployment logs and provides rollback capabilities
- **Error Handling**: Comprehensive error handling with detailed logging
- **Dry Run Support**: Test deployments without actually deploying
- **Multi-Environment Support**: Supports both production and staging environments

### Usage

```bash
# Deploy to production (default)
python3 scripts/deploy.py

# Deploy to staging
python3 scripts/deploy.py --environment=staging

# Dry run (test without deploying)
python3 scripts/deploy.py --dry-run

# Skip tests (not recommended for production)
python3 scripts/deploy.py --skip-tests

# Combine options
python3 scripts/deploy.py --environment=staging --dry-run
```

### Prerequisites

1. **Bun**: Must be installed and in PATH
2. **Wrangler CLI**: Must be installed
3. **Cloudflare Authentication**: Either authenticated via `wrangler login` OR `CLOUDFLARE_API_TOKEN` environment variable set

### Authentication

The deployment script supports two authentication methods:

1. **Wrangler CLI Authentication** (Recommended):
   ```bash
   wrangler login
   ```

2. **Environment Variable** (Fallback):
   ```bash
   export CLOUDFLARE_API_TOKEN=your_token_here
   ```

The script will automatically use Wrangler authentication if available, and only fall back to the environment variable if not authenticated.

### Application Configuration

All other environment variables and secrets should be configured through Wrangler CLI:

```bash
# Set secrets for production (if needed)
wrangler secret put WORKOS_API_KEY --env production
wrangler secret put WORKOS_CLIENT_ID --env production
wrangler secret put WORKOS_REDIRECT_URI --env production
wrangler secret put WORKOS_COOKIE_PASSWORD --env production
wrangler secret put APP_BASE_URL --env production

# Set secrets for staging (if needed)
wrangler secret put WORKOS_API_KEY --env staging
wrangler secret put WORKOS_CLIENT_ID --env staging
wrangler secret put WORKOS_REDIRECT_URI --env staging
wrangler secret put WORKOS_COOKIE_PASSWORD --env staging
wrangler secret put APP_BASE_URL --env staging
```

**Note**: The deployment script will check what secrets are configured in Wrangler but will not require specific secrets to be present. Configure only what your application actually needs.

### Deployment Process

1. **Prerequisites Check**: Verifies Bun, Wrangler, and Cloudflare authentication (or CLOUDFLARE_API_TOKEN)
2. **Secrets Check**: Lists configured Cloudflare secrets (if any)
4. **Testing**: Runs all tests (unless skipped)
5. **Building**: Builds shared, server, and client packages
6. **Deployment**: Deploys server to Workers and client to Pages
7. **Verification**: Verifies deployment success
8. **Logging**: Saves deployment log with timestamp

### Deployment Logs

Deployment logs are automatically saved to the project root with the format:
`deployment-{environment}-{timestamp}.log`

### Error Handling

The script includes comprehensive error handling:
- Custom `DeploymentError` exception for deployment-specific errors
- Detailed logging of all operations
- Graceful failure with proper exit codes
- Rollback information in logs

### Security Considerations

- Never commit secrets to version control
- Use environment variables for sensitive data
- Set Cloudflare secrets via Wrangler CLI
- Regularly rotate API keys and passwords
- Use least-privilege access for Cloudflare tokens

### Troubleshooting

#### Common Issues

1. **Authentication Error**: Run `wrangler login` to authenticate OR set `CLOUDFLARE_API_TOKEN` environment variable
3. **Build Failures**: Check TypeScript compilation and dependencies
4. **Test Failures**: Fix failing tests before deployment
5. **Secret Configuration**: Configure secrets via `wrangler secret put` if needed

#### Debug Mode

For debugging, use dry run mode:
```bash
python3 scripts/deploy.py --dry-run --environment=staging
```

This will show all commands that would be executed without actually deploying.

### Integration with CI/CD

The script can be integrated with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Deploy to Staging
  run: python3 scripts/deploy.py --environment=staging
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    WORKOS_API_KEY: ${{ secrets.WORKOS_API_KEY }}
    # ... other environment variables
```

### Best Practices

1. **Always test in staging first**: Deploy to staging before production
2. **Use dry runs**: Test deployment process with `--dry-run`
3. **Monitor deployments**: Check deployment logs and Cloudflare dashboard
4. **Keep secrets secure**: Never log or expose sensitive information
5. **Regular updates**: Keep Wrangler CLI and dependencies updated
