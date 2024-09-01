import React from 'react';
import Portfolio from '../components/Portfolio';
import PortfolioPerformance from '../components/PortfolioPerformance';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-primary">Your Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <Portfolio />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioPerformance />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
