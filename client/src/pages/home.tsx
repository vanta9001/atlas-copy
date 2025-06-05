import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Users, 
  Zap, 
  Globe, 
  GitBranch, 
  Terminal, 
  Palette, 
  Shield,
  Play,
  FileText,
  MessageSquare,
  Cloud
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Atlas</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth?mode=signup">
              <Button>Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            100% Free Forever
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Code in the cloud,
            <br />
            create anywhere
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Atlas is a powerful, collaborative coding environment that runs entirely in your browser. 
            Write, run, and share code instantly with zero setup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Play className="w-4 h-4 mr-2" />
                Start Coding Now
              </Button>
            </Link>
            <Link href="/ide">
              <Button size="lg" variant="outline">
                <Globe className="w-4 h-4 mr-2" />
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to code</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Code className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Powerful Editor</CardTitle>
                <CardDescription>
                  VS Code-powered editor with syntax highlighting, autocomplete, and 20+ language support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Terminal className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Integrated Terminal</CardTitle>
                <CardDescription>
                  Full-featured terminal with command execution, package management, and shell access
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Real-time Collaboration</CardTitle>
                <CardDescription>
                  Code together with live cursors, instant sync, and integrated team chat
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <GitBranch className="w-8 h-8 text-orange-600 mb-2" />
                <CardTitle>Git Integration</CardTitle>
                <CardDescription>
                  Built-in version control with GitHub integration, commits, and branch management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-yellow-600 mb-2" />
                <CardTitle>Instant Deployment</CardTitle>
                <CardDescription>
                  Deploy your projects instantly with one click to share with the world
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Cloud className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle>Cloud Storage</CardTitle>
                <CardDescription>
                  Your projects are automatically saved and synced across all your devices
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Start with a template</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "React", desc: "Modern React with Vite", icon: "⚛️" },
              { name: "Node.js", desc: "Express server setup", icon: "🟢" },
              { name: "Python", desc: "Flask web application", icon: "🐍" },
              { name: "Vue.js", desc: "Vue 3 with TypeScript", icon: "💚" },
            ].map((template) => (
              <Card key={template.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Atlas Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why developers choose Atlas</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">100% Free Forever</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      No hidden costs, no limits. Atlas is completely free for individuals and teams.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Zero Setup Required</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Start coding instantly. No downloads, no configuration, no environment setup.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Access Anywhere</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Code from any device, anywhere. Your projects are always in sync.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to start building?</h3>
                <p className="mb-6">Join thousands of developers already using Atlas to build amazing projects.</p>
                <Link href="/auth?mode=signup">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">Atlas</span>
              </div>
              <p className="text-gray-400">
                The free, powerful cloud IDE for modern developers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/templates">Templates</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/tutorials">Tutorials</Link></li>
                <li><Link href="/community">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Atlas. Made with ❤️ for developers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}