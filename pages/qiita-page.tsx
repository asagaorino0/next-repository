import Link from 'next/link'
import { getQIITAData } from '../lib/getQIITAData';
import styles from '../styles/Home.module.css';
export default function QiitaPage({ allData }: { allData: any }) {
    console.log(allData)

    const renderUsers = allData.map((data: any) => (
        // <Link href={`./qiita/items/`}>
        <Link href={`./qiita/items/${data.id}`}>

            {/* <Link href={`./posts/${data.user.permanent_id}`}> */}
            <div key={data.id} className={styles.card} >
                id:{data.id}<br />user.id:{data.user.id},
                <br /><img src={data.user.profile_image_url} style={{ borderRadius: '50%', width: '40px', height: '40px' }} />
                <h3>{data.user.name}</h3>
                <br />{data.title} <br />{data.user.permanent_id}
            </div>
        </Link>
    ));
    return (
        <>
            <h1>Qiita Page</h1>
            {renderUsers}
            <Link href="/post/blog">
                <a>blog-Pageへ移動</a>
            </Link>
        </>
    );
}
export async function getStaticProps() {
    const allData = await getQIITAData();
    return {
        props: {
            allData,
        },
    };
}
