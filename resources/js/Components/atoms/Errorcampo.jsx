// Components/atoms/ErrorCampo.jsx
export default function ErrorCampo({ errores, campo }) {
    if (!errores?.[campo]) return null;
    return (
        <p className="text-xs text-red-500 mt-1">
            {errores[campo][0]}
        </p>
    );
}