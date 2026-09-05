const API_BASE_URL = "https://localhost:7053/api";
export async function getProducts(){
    const response = await fetch(`${API_BASE_URL}/products`);
    if(!response.ok){
        throw new Error("Failed to fetch products");
    }
    return response.json();
}
export async function loginUser(email,password){
    const response = await fetch(`${API_BASE_URL}/auth/login`,{
        method: "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email,
            password,
        }),
    });
    if(!response.ok){
        throw new Error("Invalid email or password");
    }
    return response.json();
}
export async function registerUser(name,email,password,adminCode = null){
    const body ={
        name,
        email,
        password
    };
    if(adminCode){
        body.adminCode =adminCode;
    }
    const response = await fetch(`${API_BASE_URL}/auth/register`,{
        method : "POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(body),
    });
    if(!response.ok){
        const message = await response.text();
        throw new Error(message || "Registeration failed");
    }
    return response.json();
}
export async function addToCart(productId,quantity =1){
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/cart/items`,{
        method : "POST",
        headers:{
            "Content-Type":"application/json",
            Authorization :`Bearer ${token}`,
        },
        body:JSON.stringify({
            productId,
            quantity,
        }),
    });
    if(!response.ok){
        const message = await response.text();
        throw new Error(message|| "Failed to add item to cart");
    }
    return response.text();
} 
export async function getCart(){
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/cart`,{
        headers:{
            Authorization : `Bearer ${token}`,
        },
    });
    if(!response.ok){
        const message = await response.text();
        throw new Error(message ||"Failed to load cart");
    }
    return response.json();
}
export async function updateCartItem(cartItemId,quantity){
    const token = localStorage.getItem("token");
     const response = await fetch(
    `${API_BASE_URL}/cart/items/${cartItemId}?quantity=${quantity}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
    if(!response.ok){
        const message = await response.text();
        throw new Error(message || "Failed to update cart");
    }
    return response.text();
}

export async function removeCartItem(cartItemId){
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_BASE_URL}/cart/items/${cartItemId}`,
        {
            method:"DELETE",
            headers:{
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if(!response.ok){
        const message = await respoonse.text();
        throw new Error(message||"Failed to remove Item");
    }
}
export async function checkout(){
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Checkout failed");
  }

  return response.json();
}

export async function getOrders() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to load orders");
  }

  return response.json();
}