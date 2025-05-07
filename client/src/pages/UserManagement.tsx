import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import { UserRole } from '@/context/AuthContext';

// User type
interface User {
  id: number;
  email: string;
  role: UserRole;
  password: string; // In a real app, this would not be exposed
  lastLogin?: string;
  isActive: boolean;
}

// Current users data (in a real app, this would come from an API)
const USERS: User[] = [
  { 
    id: 1, 
    email: 'ceo@company.com', 
    role: 'CEO', 
    password: 'password', 
    lastLogin: '2023-05-06 14:32:12', 
    isActive: true 
  },
  { 
    id: 2, 
    email: 'leader@company.com', 
    role: 'LEADERSHIP TEAM', 
    password: 'password', 
    lastLogin: '2023-05-05 09:12:45', 
    isActive: true 
  },
  { 
    id: 3, 
    email: 'pe@firm.com', 
    role: 'PE & BOD', 
    password: 'password', 
    lastLogin: '2023-05-02 16:23:58', 
    isActive: true 
  },
  { 
    id: 4, 
    email: 'admin@advantageceo.com', 
    role: 'ADMIN', 
    password: 'adminpassword', 
    lastLogin: '2023-05-07 01:15:23', 
    isActive: true 
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(USERS);
  const { toast } = useToast();
  
  // Function to handle user deletion
  const handleDeleteUser = (userId: number) => {
    // In a real app, this would call an API to delete the user
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "User deleted",
      description: "The user has been deleted successfully",
    });
  };
  
  // Function to toggle user's active status
  const handleToggleStatus = (userId: number) => {
    // In a real app, this would call an API to update the user's status
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, isActive: !user.isActive };
      }
      return user;
    }));
    
    const user = users.find(u => u.id === userId);
    const newStatus = user?.isActive ? 'deactivated' : 'activated';
    
    toast({
      title: `User ${newStatus}`,
      description: `The user has been ${newStatus} successfully`,
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            Manage user access and permissions for the AdvantageCEO platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        user.role === 'ADMIN' 
                          ? 'border-purple-500 text-purple-600 bg-purple-50' 
                          : user.role === 'CEO' 
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : user.role === 'LEADERSHIP TEAM'
                              ? 'border-green-500 text-green-600 bg-green-50'
                              : 'border-amber-500 text-amber-600 bg-amber-50'
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin || 'Never'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.isActive ? "default" : "secondary"}
                      className={user.isActive ? "bg-green-500" : "bg-neutral-200 text-neutral-600"}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`h-8 px-2 ${user.isActive ? 'text-amber-500 border-amber-200 hover:bg-amber-50' : 'text-green-500 border-green-200 hover:bg-green-50'}`}
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}