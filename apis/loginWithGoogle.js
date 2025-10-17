const baseURL = import.meta.env.VITE_BASE_URL;

export const loginWithGoogle = async (idToken) => {
  const response = await fetch(`${baseURL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });
  const data = await response.json();
  if (response.status === 403) {
    alert(data.error);
  } else if (response.ok) {
    console.log(data.message);
    return response.status;
  }
};
