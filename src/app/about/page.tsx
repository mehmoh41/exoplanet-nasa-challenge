import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Github, Rocket } from 'lucide-react';
import Image from 'next/image';

const nasaImage = {
    imageUrl: `https://picsum.photos/seed/nasa-logo/200/200`,
    imageHint: 'nasa logo'
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
         <h1 className="font-headline text-3xl font-bold tracking-tight">About ExoAI Explorer</h1>
         <p className="text-muted-foreground">A World Away: Hunting for Exoplanets with AI</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative h-24 w-24 flex-shrink-0">
                 <Image 
                    src={nasaImage.imageUrl} 
                    alt="NASA Logo" 
                    fill
                    className="rounded-full object-cover"
                    data-ai-hint={nasaImage.imageHint}
                    sizes="96px"
                 />
            </div>
            <div>
              <CardTitle className="flex items-center justify-center md:justify-start gap-2">
                <Award />
                NASA Space Apps Challenge
              </CardTitle>
              <CardDescription className="mt-2">
                This project is a submission for the "A World Away: Hunting for Exoplanets with AI" challenge.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none space-y-4">
          <p>
            ExoAI Explorer is a web application designed to make the vast and complex data from NASA's Exoplanet Archive accessible and engaging for everyone. By combining real-time data fetching, interactive visualizations, and the power of generative AI, we provide tools for both amateur astronomers and the scientifically curious to explore the fascinating world of exoplanets.
          </p>
          <h3 className="font-headline">Our Goal</h3>
          <p>
            Our mission is to build a compelling and educational UI that helps users interactively explore NASA’s exoplanet data. We aim to demonstrate how AI can assist in exoplanet detection and analysis, making complex scientific interpretation more intuitive. This project is built to be visually polished, user-friendly, and ready for presentation.
          </p>
          <h3 className="font-headline">Core Technologies</h3>
          <ul>
            <li><strong>Next.js & React:</strong> For a modern, fast, and server-rendered web application.</li>
            <li><strong>Tailwind CSS & ShadCN/UI:</strong> To create a professional and responsive design system.</li>
            <li><strong>NASA Exoplanet Archive API:</strong> The source of our real-time exoplanet data.</li>
            <li><strong>Google's Gemini (via Genkit):</strong> Powering our AI-driven data analysis feature.</li>
            <li><strong>Recharts:</strong> For creating beautiful and interactive data visualizations.</li>
          </ul>

           <div className="flex gap-4 not-prose pt-4">
            <Button asChild>
              <a href="https://www.spaceappschallenge.org/" target="_blank" rel="noopener noreferrer">
                <Rocket className="mr-2 h-4 w-4" />
                Visit Space Apps
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="https://github.com/firebase/studio-templates/tree/main/exo-ai-explorer" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
