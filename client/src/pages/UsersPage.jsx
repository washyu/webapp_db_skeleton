import UserTable from '../components/UserTable';

const UsersPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold mb-6">User Management</h1>
      <UserTable />
    </div>
  );
};

export default UsersPage;