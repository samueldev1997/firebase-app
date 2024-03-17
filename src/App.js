import { useEffect, useState } from 'react';
import { db, auth } from './firebaseConnection';

import { 
    doc, 
    collection,
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc,
    onSnapshot
} from 'firebase/firestore';

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

import './app.css';

function App() {

    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [idPost, setIdPost] = useState('');
    const [posts, setPosts] = useState([]);

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [user, setUser] = useState(false)
    const [userDetail, setUserDetail] = useState({})

    useEffect(() => {
        async function loadPosts(){
            onSnapshot(collection(db, 'posts'), (snapshot) => {
                
                let listaPost = [];
                snapshot.forEach((doc) => {
                    listaPost.push({
                        id: doc.id,
                        titulo: doc.data().titulo,
                        autor: doc.data().autor
                    })
                })
                
                setPosts(listaPost);
            })
        }

        loadPosts();
    }, [])

    useEffect(() => {
         async function checkLogin(){
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setUser(true);
                    setUserDetail({
                        uid: user.uid,
                        email: user.email
                    })
                } else{
                    setUser(false);
                    setUserDetail({})
                }
            })
         }

         checkLogin();
    }, [])

    async function handleAdd(){
        await addDoc(collection(db, 'posts'), {
            titulo: titulo,
            autor: autor
        })
        .then(() => {
            setTitulo('')
            setAutor('')
            console.log('DADOS CADASTRADOS')
        })
        .catch((error) => {
            console.log('ERROR' + error)
        })
    }

    async function buscarPost(){
        await getDocs(collection(db, 'posts'))
        .then((itens) => {

            let lista = [];

            itens.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    titulo: doc.data().titulo,
                    autor: doc.data().autor
                })
            })
               
            setPosts(lista);
        })
        .catch((error) => {
            console.log('ERROR' + error)
        })
    }

    async function editarPost(){
        const postRef = doc(db, 'posts', idPost)
        
        await updateDoc(postRef, {
            titulo: titulo,
            autor: autor
        })
        .then(() => {
            console.log('POST ATUALIZADO')
            setIdPost('')
            setTitulo('')
            setAutor('')
        })
        .catch((error) => {
            console.log('ERRO AO ATUALIZAR O POST' + error)
        })

    }

    async function excluirPost(id){
        const docRef = doc(db, 'posts', id)
        await deleteDoc(docRef)
        .then(() => {
            alert('POST DELETADO COM SUCESSO!')
        })
    }

    async function novoUsuario(){
        await createUserWithEmailAndPassword(auth, email, senha)
        .then((value) => {
            console.log('CADASTRADO COM SUCESSO!')
            console.log(value)
            setEmail('')
            setSenha('')
        })
        .catch((error) => {
            if(error.code === 'auth/weak-password'){
                alert('Senha muito fraca.')
            } else if(error.code === 'auth/email-already-in-use'){
                alert('Email já existe!')
            }
        })
    }

    async function logarUsuario(){
        await signInWithEmailAndPassword(auth, email, senha)
        .then((value) => {
            console.log('USER LOGADO COM SUCESSO')
             
            setUserDetail({
                uid: value.user.uid,
                email: value.user.email
            })

            setUser(true);

            setEmail('')
            setSenha('')
        })
        .catch(() => {
            console.log('ERRO AO FAZER LOGIN')
        })
    }

    async function fazerLogout(){
        await signOut(auth)
        setUser(false)
        setUserDetail({})
    }

    return (
        <div className='container-sistema'>
            <h1> ReactJs + Firebase :) </h1>

            {user && (
                <div>
                     <strong> Seja bem Vindo(a), (você está logado!)</strong> <br/>
                     <span> Id: {userDetail.uid} - Email: {userDetail.email} </span> <br/>
                     <button onClick={fazerLogout} > Sair da conta </button>
                     <br/> <br/>
                </div>
            )}
 
            <h2> Usuários </h2>

            <div className='container'>
                <label> Email: </label>
                <input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Digite seu email'
                />

                <label> Senha: </label>
                <input 
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder='Informe sua senha'
                />

                <button onClick={novoUsuario} > Cadastrar </button>
                <button onClick={logarUsuario} > Fazer Login </button>
            </div>

             <br/><br/>

            <div className='container'>

                <h2> Posts </h2>

                <label> Id do Post </label>
                <input 
                    placeholder='Digite o id do Post'
                    value={idPost}
                    onChange={(e) => setIdPost(e.target.value)}
                />

                <label> Titulo </label>

                <textarea 
                    type='text'
                    placeholder='Digite o titulo' 
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                <label> Autor: </label>
                  
                <input 
                    type='text'
                    placeholder='Autor do post'
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                />

                <button onClick={handleAdd} > Cadastrar </button>
                <button onClick={buscarPost} > Buscar Post </button> <br/>

                <button onClick={editarPost}> Atualizar post </button>
            </div>

            <ul>
                {posts.map((item) => {
                    return(
                        <li key= {item.id} > 
                            <strong> Id:{item.id} </strong> <br/>
                            <span> Titulo:{item.titulo} </span> <br/>
                            <span> Autor:{item.autor} </span> <br/>
                            <button onClick={ () => excluirPost(item.id)} > Excluir </button> <br/> <br/>
                        </li> 
                    )
                })}
            </ul>
        </div>
    );
}

export default App;
