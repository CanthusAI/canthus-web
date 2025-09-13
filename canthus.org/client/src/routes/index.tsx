import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { hcWithType } from "server/dist/client";
import { useMutation } from "@tanstack/react-query";
import Hero from "@/components/landing/sections/hero/hero";
import { cn } from "@/lib/utils";
import { StarsBackground } from "@/components/ui/stars";
import { useTheme } from "@/components/ui/theme-provider";
import HeroGridList from "@/components/landing/sections/hero/hero-grid-list";
import Footer from "@/components/landing/sections/footer";

export const Route = createFileRoute("/")({
	component: Index,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const client = hcWithType(SERVER_URL);

type ResponseType = Awaited<ReturnType<typeof client.hello.$get>>;

function Index() {
	const [data, setData] = useState<
		Awaited<ReturnType<ResponseType["json"]>> | undefined
	>();

	const { mutate: sendRequest } = useMutation({
		mutationFn: async () => {
			try {
				const res = await client.hello.$get();
				if (!res.ok) {
					console.log("Error fetching data");
					return;
				}
				const data = await res.json();
				setData(data);
			} catch (error) {
				console.log(error);
			}
		},
	});

	return (
		<div className="w-full mx-auto flex flex-col gap-6 items-center">
			<StarsBackground
				starColor={useTheme().theme === 'dark' ? '#FFF' : '#000'}
				className={cn(
					'absolute inset-0 flex items-center justify-center rounded-xl z-[-1]',
					'dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] dark:from-[#262626] dark:via-[#262626] dark:to-transparent bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#f5f5f5] via-[#f5f5f5] to-transparent',
				)}
			/>
			<div className="mt-20">
				<Hero />
			</div>

			<div className="mx-auto mt-8">

				<HeroGridList />
			</div>
			<div className="flex items-center gap-4">
				<Button onClick={() => sendRequest()}>Call API</Button>
				<Button variant="secondary" asChild>
					<a target="_blank" href="https://bhvr.dev" rel="noopener">
						Docs
					</a>
				</Button>
			</div>
			{data && (
				<pre className="bg-gray-100 p-4 rounded-md">
					<code>
						Message: {data.message} <br />
						Success: {data.success.toString()}
					</code>
				</pre>
			)}
			<div className="mt-48"></div>
			<Footer />
		</div>
	);
}

export default Index;
