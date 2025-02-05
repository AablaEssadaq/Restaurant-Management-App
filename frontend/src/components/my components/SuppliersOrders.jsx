import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const SuppliersOrders = () => {

    const orders = [
        {
          Fournisseur: "John Doe",
          dateCommande: "16-05-2025",
          dateLivraison: "16-05-2025",
          statut:"En attente"
        },
        {
          Fournisseur: "John Doe",
          dateCommande: "16-05-2025",
          dateLivraison: "16-05-2025",
          statut:"Livrée"
        },
        {
          Fournisseur: "John Doe",
          dateCommande: "16-05-2025",
          dateLivraison: "16-05-2025",
          statut:"Annulée"
        },
        {
          Fournisseur: "John Doe",
          dateCommande: "16-05-2025",
          dateLivraison: "16-05-2025",
          statut:"En attente"
        },
        {
          Fournisseur: "John Doe",
          dateCommande: "16-05-2025",
          dateLivraison: "16-05-2025",
          statut:"En attente"
          },
     
     
      ]
    
      const columns = [
        { label: "Fournisseur", key: "Fournisseur" },
        { label: "Date de commande", key: "dateCommande" },
        { label: "Date de livraison", key: "dateLivraison" },
        { label: "Statut", key: "statut" }
      ];

  return (
    <>
     <div className='px-8 pt-2 pb-2'>
      <div className='flex justify-between items-center'>
      <div className='flex gap-1'>
      <Input className="h-8 bg-white" placeholder="Recherche" />
      <button><Search/></button>
      </div>
      <Button className="bg-green-600 hover:bg-green-800"><span><Plus/></span>Nouvelle commande</Button>
      </div>
      <br/>
      
      { /*Suppliers Orders Table */}
      <div className="overflow-auto pb-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index} className="text-black">
                {col.label}
              </TableHead>
            ))}
            <TableHead className="text-black text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((item, index) => (
            <TableRow key={index}>
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {col.key === "statut" ? ( // Apply badge only to "status" column
                    <Badge 
                      className={`
                        ${item[col.key] === "Livrée" ? "bg-green-500 hover:bg-green-500  text-white" : ""}
                        ${item[col.key] === "En attente" ? "bg-yellow hover:bg-yellow text-white" : ""}
                        ${item[col.key] === "Annulée" ? "bg-red-500 hover:bg-red-500 text-white" : ""}
                      `}
                    >
                      {item[col.key]}
                    </Badge>
                  ) : (
                    item[col.key]
                  )}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex gap-2 justify-center items-center">
                <Button className="bg-yellow hover:bg-yellow-hover" size="sm">
                    Voir détails
                  </Button>
                  <Button className="bg-orange hover:bg-orange-hover" size="sm">
                    Modifier
                  </Button>
                  <Button className="bg-burgundy hover:bg-burgundy-hover" size="sm">
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

<div className='flex justify-center items-center'>
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
</div>
      </div>
    </>
  )
}

export default SuppliersOrders