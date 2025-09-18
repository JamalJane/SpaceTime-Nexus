/* Home page component - Welcome and feature overview for Spacetime Nexus */
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
  Calendar,
  MessageSquare,
  Users,
  MapPin,
  Layers,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    /* Main home page with cosmic theme and feature descriptions */
    <div className="flex-1 p-6 space-y-8 overflow-auto">
      {/* Hero section with cosmic styling */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Spacetime Nexus
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your collaborative workspace connecting time, space, and knowledge
          across the cosmic continuum. Unite teams, manage projects, and
          discover study spaces in one immersive platform.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Calendar Feature */}
        <Card className="border-primary/20 hover-elevate group transition-all duration-300 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <Calendar className="w-6 h-6" />
              </div>
              Calendar Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 space-y-4">
            <p className="text-muted-foreground">
              Interactive calendar with event scheduling, date selection, and
              timeline management. Connect your cosmic schedule across the
              space-time continuum.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Event Scheduling
              </span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Timeline View
              </span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Reminders
              </span>
            </div>
            <div className="mt-auto">
              <Link to="/calendar">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground group-hover:translate-x-1 transition-transform">
                  Explore Calendar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Projects Feature */}
        <Card className="border-primary/20 hover-elevate group transition-all duration-300 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <Layers className="w-6 h-6" />
              </div>
              Project Management
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 space-y-4">
            <p className="text-muted-foreground">
              Kanban-style project boards with drag-and-drop tasks, team
              collaboration, and progress tracking across multiple cosmic
              dimensions.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Kanban Boards
              </span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Task Tracking
              </span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Team Collaboration
              </span>
            </div>
            <div className="mt-auto">
              <Link to="/projects">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground group-hover:translate-x-1 transition-transform">
                  View Projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Chat Feature */}
        <Card className="border-primary/20 hover-elevate group transition-all duration-300 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <MessageSquare className="w-6 h-6" />
              </div>
              Real-time Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 space-y-4">
            <p className="text-muted-foreground">
              Instant messaging with cosmic-themed chat bubbles, file sharing,
              and real-time collaboration across the nexus network.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Instant Messaging
              </span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                File Sharing
              </span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Team Channels
              </span>
            </div>
            <div className="mt-auto">
              <Link to="/chat">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground group-hover:translate-x-1 transition-transform">
                  Join Chat
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Skills Feature */}
        <Card className="border-primary/20 hover-elevate group transition-all duration-300 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <Users className="w-6 h-6" />
              </div>
              Skill Exchange
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 space-y-4">
            <p className="text-muted-foreground">
              Connect with fellow cosmic explorers, share knowledge, and
              discover new skills through our intelligent matching system.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Skill Matching
              </span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Knowledge Sharing
              </span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Networking
              </span>
            </div>
            <div className="mt-auto">
              <Link to="/skills">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground group-hover:translate-x-1 transition-transform">
                  Explore Skills
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Map Feature */}
        <Card className="border-primary/20 hover-elevate group transition-all duration-300 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <MapPin className="w-6 h-6" />
              </div>
              Study Spots
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 space-y-4">
            <p className="text-muted-foreground">
              Interactive map with location pins to discover the perfect study
              spaces, co-working areas, and cosmic collaboration zones.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Location Mapping
              </span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Space Discovery
              </span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Reviews
              </span>
            </div>
            <div className="mt-auto">
              <Link to="/map">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground group-hover:translate-x-1 transition-transform">
                  Find Study Spots
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* More Features */}
        <Card className="border-primary/20 hover-elevate group transition-all duration-300 bg-card/50 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Star className="w-6 h-6" />
              </div>
              More Features
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 space-y-4">
            <p className="text-muted-foreground">
              Additional cosmic features are being developed to enhance your
              collaborative experience across the spacetime continuum.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-muted/20 text-muted-foreground px-2 py-1 rounded">
                Coming Soon
              </span>
              <span className="text-xs bg-muted/20 text-muted-foreground px-2 py-1 rounded">
                AI Integration
              </span>
              <span className="text-xs bg-muted/20 text-muted-foreground px-2 py-1 rounded">
                Analytics
              </span>
            </div>
            <div className="mt-auto">
              <Button variant="ghost" className="w-full" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to action */}
      <div className="text-center py-8 border-t border-border">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">
          Ready to explore the Spacetime Nexus?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Choose any feature above to begin your cosmic collaboration journey.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/projects">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Start with Projects
            </Button>
          </Link>
          <Link to="/calendar">
            <Button size="lg" variant="outline">
              View Calendar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
