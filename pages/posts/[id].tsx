import React, { useState, useEffect } from 'react';
import { getAPIData } from '../../lib/getAPIData';
import { UserType } from '../../types/UserType'
import axios from 'axios'
export default function Post({ userData }: { userData: any }) {
    const [user, setUser] = useState<any>();
    useEffect(() => {
        setUser(JSON.parse(userData));
    }, []);
    return user ? (
        <div>
            <h1>{user.username}</h1>
            <p>{user.email}</p>
        </div>
    ) : null;
}
export async function getStaticPaths() {
    const paths = await getAPIDataIds();
    return {
        paths,
        fallback: false,
    };
}
export async function getStaticProps({ params }: { params: { id: string } }) {
    const userData = await getUserDataById(params.id);
    return {
        props: {
            userData,
        },
    };
}
export async function getAPIDataIds() {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users')
    const data = res.data

    return data.map((d: UserType) => {
        return {
            params: {
                id: d.id.toString()
            }
        }
    })
}

export async function getUserDataById(id: string) {
    const res = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
    const data = res.data
    return convertJson(data)
}

const convertJson = (data: UserType) => {
    return JSON.stringify(data)
}
