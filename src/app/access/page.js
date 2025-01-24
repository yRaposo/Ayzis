'use client'
import AuthStatus from "@/components/AuthStatus";
import { getAccessToken } from "@/service/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useContext, Suspense } from "react";
import { AuthContext } from "@/context/AuthContext";
import SuspenseWrapper from "@/components/SuspenseWrapper";
import { getUserQ } from "@/utils/requestQueue";

function AccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [newToken, setNewToken] = useState(null);
  const [newRefreshToken, setNewRefreshToken] = useState(null);
  const { token, setToken, setRefreshToken, addAccount, isError, setIsError } = useContext(AuthContext);
  const [code, setCode] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    if (newToken && newRefreshToken && newUserEmail) {
      if (!token || userEmail === newUserEmail) {
        setToken(newToken);
        setRefreshToken(newRefreshToken);
        addAccount(newToken, newRefreshToken, newUserEmail);
        router.push('/dashboard');
      } else {
        addAccount(newToken, newRefreshToken, newUserEmail);
        router.push('/dashboard/profile');
      }

    }
  }, [newToken, newRefreshToken, newUserEmail, token, userEmail]);

  useEffect(() => {
    if (newToken) {
      getUserQ(newToken)
        .then((data) => {
          setNewUserEmail(data.data.email);
        })
        .catch((error) => {
          console.error('Erro ao obter Usuario:', error);
        });
    }
  }, [newToken]);

  useEffect(() => {
    if (token) {
      getUserQ(token)
        .then((data) => {
          setUserEmail(data.data.email);
        })
        .catch((error) => {
          console.error('Erro ao obter Usuario:', error);
        });
    }
  }, [token]);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setCode(code);
    } else {
      const randomState = Math.random().toString(36).substring(2, 15);
      setState(randomState);
      window.location.href = `https://bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&state=${randomState}`;
    }
  }, [searchParams]);

  useEffect(() => {
    if (code) {
      setIsError(false);
      getAccessToken(code)
        .then((data) => {
          if (data) {
            setNewToken(data.access_token);
            setNewRefreshToken(data.refresh_token);
            setIsError(false);
          }
        })
        .catch((error) => {
          console.error('Erro ao obter Token', error);
          setIsError(true);
          router.push('/access');
        });
    }
  }, [code]);

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">
        Plan Up
      </h1>
      <AuthStatus isError={isError} token={newToken} code={code} />
    </div>
  );
}

export default function Access() {
  return (
    <SuspenseWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <AccessContent />
      </Suspense>
    </SuspenseWrapper>
  );
}