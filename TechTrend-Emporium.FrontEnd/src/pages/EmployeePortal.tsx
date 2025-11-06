export default function EmployeePortal() {
  return (
    <div>
      <main className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Employee Portal</h1>
        <p className="mb-6">Welcome to the employee portal. Use the navigation on the left to access admin tools.</p>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded">Orders management placeholder</div>
          <div className="p-4 border rounded">Products management placeholder</div>
          <div className="p-4 border rounded">Users & permissions placeholder</div>
          <div className="p-4 border rounded">Reports & analytics placeholder</div>
        </section>
      </main>
    </div>
  );
}
