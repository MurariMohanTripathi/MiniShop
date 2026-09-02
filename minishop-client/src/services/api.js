const API_BASE_URL = "https://localhost:7053/api";
export async function getProducts(){
    const response = await fetch(`${API_BASE_URL}/products`);
    if(!response.ok){
        throw new Error("Failed to fetch products");
    }
    return response.json();
}