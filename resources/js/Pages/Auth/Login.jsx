import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import MicrochipLoadingIcon from '@/Components/atoms/MicrochipLoadingIcon.jsx';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LockKeyhole, Mail } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesion" />

            <div className="mb-8">
                <p className="text-xs font-semibold uppercase text-gray-400">
                    Acceso privado
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                    Iniciar sesion
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Entra con tu cuenta para continuar al panel de logistica.
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Correo electronico" className="text-xs font-semibold uppercase text-gray-500" />

                    <div className="relative mt-2">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full rounded-lg border-gray-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Contrasena" className="text-xs font-semibold uppercase text-gray-500" />

                    <div className="relative mt-2">
                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full rounded-lg border-gray-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Recordarme
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Olvide mi contrasena
                        </Link>
                    )}
                </div>

                <div>
                    <PrimaryButton
                        className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm normal-case tracking-normal hover:bg-blue-700 focus:bg-blue-700 focus:ring-blue-500 active:bg-blue-800"
                        disabled={processing}
                    >
                        {processing ? (
                            <span className="inline-flex items-center gap-2">
                                <MicrochipLoadingIcon size={18} label="Entrando" />
                                Entrando...
                            </span>
                        ) : 'Entrar'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
