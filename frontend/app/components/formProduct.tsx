import { useState } from "react";
import { toast } from "../hooks/use-toast";

interface FormProductProps {
  onAddProduct: (newProduct: { name: string; price: number }) => void;
}

const FormProduct: React.FC<FormProductProps> = ({ onAddProduct }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        onAddProduct(newProduct);
        toast({
          title: "Sucesso!",
          description: "Produto cadastrado com sucesso.",
          variant: "success",
        });
        setName("");
        setPrice("");
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro ao cadastrar produto",
          description: errorData.message || "Erro desconhecido.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Erro ao cadastrar produto",
        description: (error as Error).message || "Erro desconhecido.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm">
          Nome do produto
        </label>
        <input
          className="p-2 bg-transparent rounded-lg border-white border"
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
        <input
          className="p-2 bg-transparent rounded-lg border-white border"
          type="number"
          id="price"
          name="price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />
      </div>
      <button
        type="submit"
        className="p-2 bg-white text-black rounded-lg font-semibold"
      >
        Cadastrar
      </button>
    </form>
  );
};

export default FormProduct;
