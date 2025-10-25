import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { HeroVideoDialog } from "./hero-video-dialog";

export default function Hero() {
  return (
    <section className="py-16 md:py-20 lg:py-32">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 lg:gap-6">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            One-Click Clarity for{" "}
            <span className="relative">
              <span className="relative z-10">Everyone</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-background blur-md opacity-35"></span>
            </span>
          </h1>
          <p className="text-muted-foreground text-balance md:text-lg">
            Accessibility solutions <span className="font-bold">built for the platforms your team already uses.</span>
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <a href="#">Start Building Inclusively</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Try Demo
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Free trial available
          </p>

          <div className="relative mt-8">
            <div className="relative z-10 overflow-hidden group rounded-lg">
              <div className="relative">
                <HeroVideoDialog
                  className="dark:hidden block"
                  animationStyle="from-center"
                  videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                  thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                  thumbnailAlt="Hero Video"
                />
                <HeroVideoDialog
                  className="hidden dark:block"
                  animationStyle="from-center"
                  videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                  thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
                  thumbnailAlt="Hero Video"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
