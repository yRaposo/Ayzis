export default function StylezedBtn({ props, onClick, disable }) {
    return (
        <button onClick={onClick} className={`flex gap-2 bg-white hover:bg-black text-black hover:text-white font-bold py-2 px-4 rounded-full border border-black ${disable ? 'cursor-not-allowed' : 'cursor-pointer'}`} disabled={disable}>
            {props.icon ? <div className="my-auto">
                {props.icon}
            </div> : null}
            {props.text ? <div>
                {props.text}
            </div> : null}
        </button>
    )
}