import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Spinner from './components/spinner/spinner';

interface User {
  email: string;
  name: {
    first: string;
    last: string;
  };
  picture: {
    thumbnail: string;
  };
  gender: string;
  phone: string;
  dob: {
    age: number;
  };
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const filterByGender = () => {
    if (selectedGender === 'male' || selectedGender === 'female') {
      return users.filter((user: any) => user.gender === selectedGender);
    }
    return users;
  };

  const sortByAge = (userList: any[]) => {
    if (selectedAge === 'asc') {
      return [...userList].sort((a, b) => a.dob.age - b.dob.age);
    }
    if (selectedAge === 'desc') {
      return [...userList].sort((a, b) => b.dob.age - a.dob.age);
    }
    return userList;
  };

  const searchUser = (userList: any[]) => {
    if (search) {
      return userList.filter((user: any) => {
        return (
          user.name.first.toLowerCase().includes(search.toLowerCase()) ||
          user.name.last.toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    return userList;
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://randomuser.me/api/?results=20');
      setUsers(response.data.results);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const usersToDisplay = searchUser(sortByAge(filterByGender()));

  return (
    <>
      <div className="container-fluid">
        <div>
          <hr />
          <button onClick={fetchUsers} className="btn btn-primary">
            Récupérer les utilisateurs
          </button>
          <button onClick={() => setUsers([])} className="btn btn-danger" disabled={!users.length}>
            Effacer les utilisateurs
          </button>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un utilisateur"/>
          <hr />
          <label htmlFor="selectedGender">Filtrer par :</label>
          <select value={selectedGender} onChange={e => setSelectedGender(e.target.value)}>
            <option value="male">homme</option>
            <option value="female">femme</option>
            <option value="both">les deux</option>
          </select>
          <label htmlFor="selectedAge">Trier par :</label>
          <select value={selectedAge} onChange={e => setSelectedAge(e.target.value)}>
            <option value="asc">croissant</option>
            <option value="desc">décroissant</option>
            <option value="none">aucun</option>
          </select>
        </div>
        {isLoading ? (<Spinner />) : usersToDisplay.length > 0 ? (
          <table id="tbl-users" className="table table-hover">
            <thead>
              {usersToDisplay.map((user: any) => (
                <tr key={user.email}>
                  <td>
                    <img src={user.picture.thumbnail} alt={user.name.first} />
                  </td>
                  <td>{user.gender === 'male' ? 'Monsieur' : 'Madame'} {user.name.first} {user.name.last}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.dob.age}</td>
                </tr>
              ))}
            </thead>
          </table>
        ) : (
          <div className="alert alert-info">
            <h1>Pas d'utilisateurs</h1>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
