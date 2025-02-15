import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Logout = () => {
  const [dataSources, setDataSources] = useState<any[]>([]);

  useEffect(() => {
  
    window.history.replaceState(null, '','/logout');

    async function fetchData() {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('https://demo-server.gawx.ai/api/v1/data_sources/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setDataSources(response.data);
      } catch (error) {
        console.error('Error fetching data sources:', error);
      }
    }

    fetchData();
  }, []);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
   
    
    window.location.href = '/logout'; 
    window.location.href = '/';
  }

  return (
    <div className="mx-auto max-w-screen-xl p-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataSources.map((source) => (
            <TableRow key={source.id}>
              <TableCell className="font-medium">{source.id}</TableCell>
              <TableCell>{source.name}</TableCell>
              <TableCell>{source.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleLogout} className="bg-black hover:bg-gray-500 text-white px-4 py-2 rounded">
        Logout
      </Button>
    </div>
  );
};

export default Logout;
