import Link from 'next/link'
import { getAPIData } from '../lib/getAPIData';
import styles from '../styles/Home.module.css';
export default function SecondPage({ allData }: { allData: any }) {
    console.log(allData)

    const renderUsers = allData.map((data: any, index: number) => (
        <Link href={`./posts/${data.id}`}>
            <div key={index.toString()} className={styles.card} >
                id:{data.id},name:{data.name},email:{data.email}



            </div>
        </Link>
    ));
    return (
        <>
            <h1>Second Page</h1>
            {renderUsers}
            <Link href="/post/blog">
                <a>blog-Pageへ移動</a>
            </Link>
        </>
    );
}
export async function getStaticProps() {
    const allData = await getAPIData();
    return {
        props: {
            allData,
        },
    };
}
