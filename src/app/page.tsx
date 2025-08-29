'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowRight, Home, Palette, LayoutGrid, Calculator, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { toast } = useToast();
  const { login, register, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "AI-Powered Design",
      description: "Get intelligent design suggestions and automated layouts powered by advanced AI.",
    },
    {
      icon: <Palette className="h-6 w-6 text-primary" />,
      title: "Mood Board Generation",
      description: "Create beautiful mood boards with AI-curated images and color palettes.",
    },
    {
      icon: <LayoutGrid className="h-6 w-6 text-primary" />,
      title: "2D Space Planning",
      description: "Generate optimized 2D layouts for your space with furniture placement.",
    },
    {
      icon: <Calculator className="h-6 w-6 text-primary" />,
      title: "Bill of Quantities",
      description: "Automatically generate detailed BOQs with cost estimates for your project.",
    },
  ];

  const workflow = [
    { step: 1, title: "Consultation", description: "Share your vision and requirements" },
    { step: 2, title: "AI Analysis", description: "Our AI processes your needs and preferences" },
    { step: 3, title: "Design Generation", description: "Receive personalized design concepts" },
    { step: 4, title: "Review & Refine", description: "Collaborate and perfect your design" },
  ];

  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="flex justify-between p-4 shadow-sm bg-white">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Home className="h-7 w-7 text-primary" />
          AI Interior Designer
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setIsLoginOpen(true)}>Login</Button>
          <Button onClick={() => setIsRegisterOpen(true)}>Sign Up</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 text-center bg-gray-50">
        <h1 className="text-4xl font-extrabold mb-2">Transform Your Space with AI</h1>
        <p className="max-w-xl mx-auto text-lg text-muted-foreground">
          Experience the future of interior design with our AI-powered platform. From concept to completion,
          we help you create beautiful, functional spaces tailored to your unique style and needs.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Powerful Features</h2>
          <p className="text-muted-foreground">Everything you need to bring your interior design vision to life</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 bg-gray-50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">Our streamlined process makes interior design simple and enjoyable</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {workflow.map((item) => (
            <div key={item.step} className="bg-white p-6 rounded-lg shadow w-64">
              <Badge variant="outline" className="mb-2">{item.step}</Badge>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-primary text-white">
        <h2 className="text-3xl font-bold mb-2">Ready to Transform Your Space?</h2>
        <p className="mb-4">Join thousands of satisfied clients who have created their dream spaces with AI.</p>
        <Button size="lg" variant="secondary" onClick={() => setIsRegisterOpen(true)}>
          Get Started <ArrowRight className="ml-2" />
        </Button>
      </section>

      {/* Login/Register Dialogs */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>Access your account</DialogDescription>
          </DialogHeader>
          <LoginForm onSuccess={() => setIsLoginOpen(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>Create a new account</DialogDescription>
          </DialogHeader>
          <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground bg-white">
        &copy; {new Date().getFullYear()} AI Interior Designer. All rights reserved.
      </footer>
    </div>
  );
}

// You will need to ensure LoginForm and RegisterForm are defined as before, or refactor them as needed.
