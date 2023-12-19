import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PatientContractABI from './PatientContractABI.json'; // Remplacez ceci par le chemin de votre ABI

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545/"));

const Patients = () => {
    const [patientId, setPatientId] = useState('');
    const [id, setId] = useState(0);
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [age, setAge] = useState(0);
    const [numSecu, setNumSecu] = useState(0);


    const contractAddress = '0xaDa24EA6dbB4D3ed079d87Ce7406a852a1D7239f'; // Remplacez ceci par l'adresse de votre contrat
    const contract = new web3.eth.Contract(PatientContractABI, contractAddress);

    const handleSearch = async () => {
        console.log("patientId ", patientId)
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("metamask ", accounts[0])
        const patientAddress = await contract.methods.patientIds().call()
            .then(result => {
                console.log('result ', result)
            }).catch(e => {
                console.log('erreur ', e)
            })

        await contract.methods.getPatientInfoById(parseInt(patientId)).call((error, result) => {
            if (!error) {
                console.log('Message:', result);
            } else {
                console.error(error);
            }
            setPatientId(0)
        });
    };

    const handleAddPatient = async () => {
        try {

            console.log("input ", parseInt(id), nom, prenom, age, numSecu)
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('accounts ', accounts[0])
            await contract.methods.ajouterPatient(parseInt(id), nom, prenom, parseInt(age), parseInt(numSecu)).send({ from: accounts[0] })
                .then(result => {
                    console.log('result 2', result)
                    
                }).catch(e => {
                    console.log('erreur ', e)
                })
                alert('Patient ajouté avec succès!');
            // Réinitialiser les champs après l'ajout
        } catch (error) {
            console.error('Erreur lors de l\'ajout du patient:', error);
        }
    };

    const checkEthereum = () => {
        if (typeof window.ethereum !== 'undefined') {
            console.log('Ethereum is available');
            const web3 = new Web3(window.ethereum);

            // Vérifier si MetaMask est installé
            if (web3.currentProvider.isMetaMask) {
                console.log('MetaMask is installed');

                // Vérifier si MetaMask est connecté
                web3.eth.getAccounts((error, accounts) => {
                    if (error) {
                        console.error('Erreur lors de la récupération des comptes:', error);
                    } else if (accounts.length === 0) {
                        console.log('MetaMask est installé mais non connecté');
                    } else {
                        console.log('MetaMask est installé et connecté');
                    }
                });
            }
        } else {
            console.log('Ethereum is not available');
        }
    };

    // Appel de la fonction de vérification

    useEffect(() => {
        checkEthereum();
        console.log("contract ", contract.methods)
    }, []);

    return (
        <div style={{ marginTop: 100, justifyContent: 'center', alignContent: 'center' }}>
            <input
                type="text"
                placeholder="ID du patient"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
            />
            <button onClick={handleSearch}>Rechercher</button>
            {
                patientId >0 && (

                    <div>
                        <h2>Informations du patient:</h2><br />
                        <p>Nom: {nom}</p><br />
                        <p>Prénom: {prenom}</p><br />
                        <p>Age: {age}</p><br />
                        <p>Numéro Sécurité Sociale: {numSecu}</p><br />
                    </div>

                )
            }

            <div>
                <h2>Ajouter un patient</h2>
                <input
                    type="text"
                    placeholder="ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                /><br /><br />
                <input
                    type="text"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                /><br /><br />
                <input
                    type="text"
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                /><br /><br />
                <input
                    type="text"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                /><br /><br />
                <input
                    type="text"
                    placeholder="Numéro Sécurité Sociale"
                    value={numSecu}
                    onChange={(e) => setNumSecu(e.target.value)}
                /><br /><br />
                <button onClick={handleAddPatient}>Ajouter Patient</button>
            </div>

        </div>
    );
};

export default Patients;
