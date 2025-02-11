import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const formatDate = (dateString) => {
  return format(new Date(dateString), "dd-MM-yyyy", { locale: fr });
};

const OrderDetailsDialog = ({ order }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-yellow hover:bg-yellow-hover" size="sm">
          Voir détails
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-screen">
        <DialogHeader>
          <DialogTitle>Détails de la commande</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Date de commande</label>
            <Input 
              disabled 
              value={formatDate(order.orderDate)}
              className="bg-gray-100"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Date de livraison</label>
            <Input 
              disabled 
              value={formatDate(order.shippingDate)}
              className="bg-gray-100"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Fournisseur</label>
            <Input 
              disabled 
              value={`${order.supplier.firstName} ${order.supplier.lastName}`}
              className="bg-gray-100"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Méthode de paiement</label>
            <Input 
              disabled 
              value={order.supplier.paymentMethod}
              className="bg-gray-100"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Statut</label>
            <div className="mt-1">
              <Badge className={` 
                ${order.status === "livrée" ? "bg-green-500 hover:bg-green-500 text-white" : ""} 
                ${order.status === "En cours" ? "bg-yellow hover:bg-yellow text-white" : ""} 
                ${order.status === "Annulée" ? "bg-red-500 hover:bg-red-500 text-white" : ""} 
              `}>
                {order.status}
              </Badge>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Total</label>
            <Input 
              disabled 
              value={`${order.total.toLocaleString()}$`}
              className="bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Produits</label>
          <ScrollArea className="h-65 mt-2 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.product}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.price.toLocaleString()}$</TableCell>
                    <TableCell>{(product.quantity * product.price).toLocaleString()}$</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;