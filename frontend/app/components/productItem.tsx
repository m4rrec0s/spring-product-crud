"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { toast } from "../hooks/use-toast";

interface ProductItemProps {
  product: Product;
  onEditProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: number) => void;
}

const ProductItem = ({
  product,
  onEditProduct,
  onDeleteProduct,
}: ProductItemProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, price }),
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        onEditProduct(updatedProduct);
        setIsEditDialogOpen(false);
        toast({
          title: "Sucesso!",
          description: "Produto editado com sucesso.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao editar produto",
        description: (error as Error).message || "Erro desconhecido.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        onDeleteProduct(product.id);
        toast({
          title: "Produto excluído",
          description: "O produto foi excluído com sucesso.",
          variant: "destructive",
        });
      } else {
        throw new Error("Erro ao excluir o produto.");
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir produto",
        description: (error as Error).message || "Erro desconhecido.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-2 flex items-center justify-between">
      <div className="flex flex-col">
        <h3 className="text-sm font-medium truncate max-w-[200px]">
          {product.name}
        </h3>
        <p className="text-xl font-extrabold">
          {formatCurrency(product.price)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => {
            setIsEditDialogOpen(true);
            setName(product.name);
            setPrice(product.price);
          }}
        >
          <Edit2 size={20} />
        </Button>

        <Button
          variant={"destructive"}
          size={"icon"}
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 size={20} />
        </Button>
      </div>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={() => setIsEditDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar produto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-2 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm">
                Nome do produto
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="price" className="text-sm">
                Preço
              </label>
              <Input
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
            <Button type="submit">Salvar</Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogContent aria-describedby="delete-description">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deseja realmente excluir o produto?
            </AlertDialogTitle>
            <AlertDialogDescription id="delete-description">
              Após confirmar o produto {product.name} será excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
                setIsDeleteDialogOpen(false);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductItem;
