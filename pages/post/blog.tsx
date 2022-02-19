import { useRouter } from 'next/router';
export default function BlogPage() {
    const router = useRouter();
    const tofirstPage = () => {
        router.push('../first-Page')
    }
    return (
        <>
            <h1>BlogPage</h1>
            <button onClick={tofirstPage}>first-pageへ移動 </button>
        </>

    );
}