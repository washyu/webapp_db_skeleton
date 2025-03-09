import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";
import { SpriteSheet } from '../utils/spriteSheet';

// Import your sprite sheet (put it in the public folder)
const avatarSheetSrc = '/avatars.jpg'; // Update this path to your actual sprite sheet
const avatarSheet = new SpriteSheet(avatarSheetSrc, 64, 64, 5, 3); // Adjust dimensions based on your sprite sheet

const API_BASE_URL = 'http://localhost:3001';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [avatars, setAvatars] = useState({});
  
  // Form state for adding new user
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    address: '',
    age: '',
    avatarIndex: Math.floor(Math.random() * 15) // Random avatar index (5×3=15 avatars)
  });

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      if (response.data.success) {
        // Assign random avatar indices if not present
        const usersWithAvatars = response.data.data.map(user => {
          if (!user.avatarIndex) {
            user.avatarIndex = Math.floor(Math.random() * 15);
          }
          return user;
        });
        setUsers(usersWithAvatars);
        
        // Pre-load avatar data URLs
        const avatarPromises = {};
        for (let i = 0; i < 15; i++) {
          avatarPromises[i] = avatarSheet.getSpriteDataUrl(i);
        }
        
        Promise.all(Object.values(avatarPromises)).then(() => {
          setAvatars(avatarPromises);
        });
        
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError('Error loading users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Change avatar in the form
  const changeAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatarIndex: (prev.avatarIndex + 1) % 15
    }));
  };

  // Add new user
  const addUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users`, formData);
      if (response.data.success) {
        // Add new user to the list with avatar
        const newUser = {
          ...response.data.data,
          avatarIndex: formData.avatarIndex
        };
        setUsers(prev => [...prev, newUser]);
        
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          address: '',
          age: '',
          avatarIndex: Math.floor(Math.random() * 15)
        });
        
        // Close dialog
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert(error.response?.data?.message || 'Error adding user');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchString = searchTerm.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(searchString) ||
      user.last_name?.toLowerCase().includes(searchString) ||
      user.email?.toLowerCase().includes(searchString) ||
      user.address?.toLowerCase().includes(searchString)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Users</CardTitle>
        <CardDescription>Manage user accounts in the system.</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-6 gap-4">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Add User Button */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new user account.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={addUser}>
                {/* Avatar selector */}
                <div className="flex justify-center mb-4">
                  <div 
                    className="w-16 h-16 rounded-full overflow-hidden cursor-pointer"
                    style={avatarSheet.getSpriteCss(formData.avatarIndex)}
                    onClick={changeAvatar}
                    title="Click to change avatar"
                  ></div>
                </div>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input 
                        id="first_name" 
                        name="first_name"
                        value={formData.first_name} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input 
                        id="last_name" 
                        name="last_name"
                        value={formData.last_name} 
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password"
                      type="password"
                      value={formData.password} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      name="address"
                      value={formData.address} 
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      name="age"
                      type="number"
                      value={formData.age} 
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Add User</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Users Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Age</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="w-8 h-8 rounded-full overflow-hidden" style={avatarSheet.getSpriteCss(user.avatarIndex || 0)}></div>
                    </TableCell>
                    <TableCell className="font-medium">{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.address || "—"}</TableCell>
                    <TableCell>{user.age || "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserTable;