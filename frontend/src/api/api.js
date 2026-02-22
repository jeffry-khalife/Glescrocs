const API = "http://localhost:5000/api";

export const getMenus = async () => {
  const res = await fetch(`${API}/menus`);
  return res.json();
};

export const createOrder = async (menu_id) => {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menu_id }),
  });
  return res.json();
};

export const getQueue = async () => {
  const res = await fetch(`${API}/orders/queue`);
  return res.json();
};

export const loginAdmin = async (username, password) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

export const createMenu = async (menuData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/menus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(menuData),
  });
  return res.json();
};

export const updateMenu = async (id, menuData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/menus/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(menuData),
  });
  return res.json();
};

export const deleteMenu = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/menus/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const createUser = async (userData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/auth/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const getUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/auth/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};