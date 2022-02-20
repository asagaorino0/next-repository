import React, { useState, useEffect } from 'react';
import { getQIITAData } from '../../../lib/getQIITAData';
import { QiitaType } from '../../../types/QiitaType'
import axios from 'axios'
export default function Post({ userData }: { userData: any }) {
    const [user, setUser] = useState<any>();
    useEffect(() => {
        setUser(JSON.parse(userData));
    }, []);
    return user ? (
        <div>
            <h1>{user.title}</h1>
            <p>{user.description}</p>
        </div>
    ) : null;
}
export async function getStaticPaths() {
    const paths = await getQIITADataIds();
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
export async function getQIITADataIds() {
    const res = await axios.get('https://qiita.com/api/v2/items')
    const data = res.data

    return data.map((d: QiitaType) => {
        return {
            params: {
                id: d.id.toString()
            }
        }
    })
}

export async function getUserDataById(id: string) {
    const res = await axios.get(`https://qiita.com/api/v2/items/${id}`)
    const data = res.data
    return convertJson(data)
}

const convertJson = (data: QiitaType) => {
    return JSON.stringify(data)
}
