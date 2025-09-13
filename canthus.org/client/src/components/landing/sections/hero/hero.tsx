import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="py-16 md:py-20 lg:py-32">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 lg:gap-6">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            One-Click Clarity for{" "}
            <span className="relative">
              <span className="relative z-10">Everyone</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-white dark:to-black blur-md opacity-35"></span>
            </span>
          </h1>
          <p className="text-muted-foreground text-balance md:text-lg">
            Accessibility solutions, <span className="font-bold">built for the platforms your team already uses.</span>
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <a href="#">Start Building Inclusively</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Watch Demo
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Free trial available
          </p>

          <div className="relative mt-8">
            <div className="relative z-10 overflow-hidden">
              <img
                src="/images/demo.png"
                alt="Demo preview"
                className="w-full max-w-5xl h-auto shadow-2xl rounded-lg gradient-to-b from-blue-500 via-blue-400 to-white dark:to-black"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
