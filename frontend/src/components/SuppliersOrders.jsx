import { Plus, Search } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import TableComponent from './TableComponent'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

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
      <TableComponent columns={columns} data={orders}/>

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