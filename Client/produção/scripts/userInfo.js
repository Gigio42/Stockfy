export function setUserInfo() {
  const userName = localStorage.getItem('userName');
  document.getElementById('user-name').textContent = userName;
}

export function setMachineName(name) {
  document.getElementById('machine-name').textContent = name;
}