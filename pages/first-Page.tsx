import { useRouter } from 'next/router';
export default function FirstPost() {
    const router = useRouter();
    const toblog = () => {
        router.push('./post/blog')
    }
    return (
        <>
            <h1>First Post</h1>
            <button onClick={toblog}>blog-pageへ移動 </button>
        </>
    );
}