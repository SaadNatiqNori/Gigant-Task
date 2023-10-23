// Import Scoped Style

// Other Imports
import Basket from "@/components/pages/Basket";
import Products from "@/components/pages/Products";

export default function Home() {
  return (
    <main className={`relative m-5`}>
      <div className="w-full flex flex-wrap md:flex-nowrap justify-around items-start gap-4">
        {/* Products Component */}
        <Products />
        {/* Basket Component */}
        <Basket />
      </div>
    </main>
  );
}
