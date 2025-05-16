
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import PathCard from "@/components/PathCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const LearningPaths = () => {
  const { currentUser } = useAuth();
  const { learningPaths } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter learning paths based on search query
  const filteredPaths = learningPaths.filter(path => 
    path.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    path.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Learning Paths</h1>
            <p className="text-muted-foreground">
              Structured learning journeys to help you achieve your goals
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search learning paths..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Paths Grid */}
        {filteredPaths.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <PathCard key={path.id} path={path} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Learning Paths Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 
                "Try adjusting your search" : 
                "There are no learning paths available at the moment"
              }
            </p>
            
            {currentUser?.role === "instructor" && (
              <Button>Create Learning Path</Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LearningPaths;
