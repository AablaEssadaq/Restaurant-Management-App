import React from 'react'
import { Input } from './ui/input'
import { Plus, Search } from 'lucide-react'
import { Button } from './ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import TableComponent from './ui/TableComponent'


const SuppliersList = () => {

  const suppliers = [
    {
      nomComplet: "John Doe",
      catégorie: "Nourriture",
      téléphone: "0612345678",
      email:"johndoe@gmail.com"
    },
    {
      nomComplet: "John Doe",
      catégorie: "Nourriture",
      téléphone: "0612345678",
      email:"johndoe@gmail.com"
    },
    {
      nomComplet: "John Doe",
      catégorie: "Nourriture",
      téléphone: "0612345678",
      email:"johndoe@gmail.com"
    },
    {
      nomComplet: "John Doe",
      catégorie: "Nourriture",
      téléphone: "0612345678",
      email:"johndoe@gmail.com"
    },
    {
      nomComplet: "John Doe",
      catégorie: "Nourriture",
      téléphone: "0612345678",
      email:"johndoe@gmail.com"
    },
 
 
  ]

  const columns = [
    { label: "Nom Complet", key: "nomComplet" },
    { label: "Catégorie", key: "catégorie" },
    { label: "Téléphone", key: "téléphone" },
    { label: "Email", key: "email" }
  ];

  return (
    <>
    <div className='px-8 pt-2 pb-2'>
      <div className='flex justify-between items-center'>
      <div className='flex gap-1'>
      <Input className="h-8 bg-white" placeholder="Recherche" />
      <button><Search/></button>
      </div>
      <Button className="bg-green-600 hover:bg-green-800"><span><Plus/></span>Nouveau fournisseur</Button>
      </div>
      <br/>
    
    <TableComponent columns={columns} data={suppliers}/>
   

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

export default SuppliersList