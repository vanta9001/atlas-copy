
export async function apiRequest(url: string, options: RequestInit = {}) {
  // Get current user for authentication
  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': currentUser?.id?.toString() || '1',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}
