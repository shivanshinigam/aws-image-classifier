import React from 'react';
import { 
  Cloud, 
  Database, 
  Zap, 
  Brain, 
  Bell, 
  GitBranch, 
  Shield,
  Monitor
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const services = [
    { 
      name: 'S3 Storage', 
      icon: Cloud, 
      color: 'bg-orange-100 text-orange-600',
      description: 'Image upload & storage'
    },
    { 
      name: 'Lambda', 
      icon: Zap, 
      color: 'bg-yellow-100 text-yellow-600',
      description: 'Serverless processing'
    },
    { 
      name: 'SageMaker', 
      icon: Brain, 
      color: 'bg-purple-100 text-purple-600',
      description: 'ML model inference'
    },
    { 
      name: 'DynamoDB', 
      icon: Database, 
      color: 'bg-blue-100 text-blue-600',
      description: 'Results storage'
    },
    { 
      name: 'SNS/SES', 
      icon: Bell, 
      color: 'bg-green-100 text-green-600',
      description: 'Notifications'
    },
    { 
      name: 'CodePipeline', 
      icon: GitBranch, 
      color: 'bg-indigo-100 text-indigo-600',
      description: 'CI/CD deployment'
    },
    { 
      name: 'Model Monitor', 
      icon: Monitor, 
      color: 'bg-red-100 text-red-600',
      description: 'Drift detection'
    },
    { 
      name: 'CloudWatch', 
      icon: Shield, 
      color: 'bg-teal-100 text-teal-600',
      description: 'Monitoring & logs'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <GitBranch className="w-6 h-6 mr-2 text-blue-500" />
        AWS Architecture Overview
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.name} className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-xl ${service.color} flex items-center justify-center mb-3`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="font-medium text-gray-800 text-sm mb-1">{service.name}</h3>
              <p className="text-xs text-gray-500">{service.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Data Flow Process</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
            <span>User uploads image → S3 bucket trigger</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
            <span>Lambda function processes upload event</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
            <span>SageMaker endpoint performs classification</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
            <span>Results stored in DynamoDB with metadata</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">5</div>
            <span>SNS/SES sends notification to user</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">6</div>
            <span>Model Monitor tracks performance & drift</span>
          </div>
        </div>
      </div>
    </div>
  );
};
