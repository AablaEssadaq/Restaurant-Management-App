import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TableComponent = ({ columns, data }) => {
  return (
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
          {data.map((item, index) => (
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
  );
};

export default TableComponent;
