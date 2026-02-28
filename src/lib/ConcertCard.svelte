<script>
	import { createEventDispatcher } from 'svelte';

	export let concert;

	const dispatch = createEventDispatcher();
	const API = "http://localhost:3000";

	let name = "";
	let qty = 1;
	let tickets = [];
	let showTickets = false;
	let buying = false;
	let message = null;
	let error = null;

	async function buy() {
		if (!name || qty <= 0) {
			error = "Please enter a valid name and quantity.";
			return;
		}

		buying = true;
		error = null;
		message = null;

		try {
			const res = await fetch(`${API}/boletos`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					conciertoId: concert.id,
					comprador: name,
					cantidad: qty
				})
			});

			const data = await res.json();

			if (!res.ok) throw new Error(data.message);

			message = "Purchase successful 🎉";
			name = "";
			qty = 1;

			dispatch("refresh");
		} catch (err) {
			error = err.message;
		} finally {
			buying = false;
		}
	}

	async function loadTickets() {
		showTickets = !showTickets;

		if (!showTickets) return;

		const res = await fetch(`${API}/boletos/${concert.id}`);
		tickets = await res.json();
	}
</script>

<style>
	.card {
		background: #1e293b;
		padding: 1.5rem;
		border-radius: 12px;
		box-shadow: 0 0 10px rgba(0,0,0,.4);
	}

	input {
		width: 100%;
		padding: 0.5rem;
		border-radius: 6px;
		border: none;
		margin-bottom: 0.5rem;
	}

	button {
		background: #22c55e;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		color: white;
		cursor: pointer;
		font-weight: bold;
		margin-right: 0.5rem;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.secondary {
		background: #3b82f6;
	}

	.ticket {
		background: #334155;
		padding: 0.5rem;
		border-radius: 6px;
		margin-top: 0.5rem;
	}
</style>

<div class="card">
	<h2>{concert.artista}</h2>
	<p>{concert.fecha} — {concert.hora}</p>
	<p>{concert.sede}, {concert.ciudad}</p>
	<p><strong>${concert.precio}</strong></p>
	<p>
		Vendidos: {concert.boletos_vendidos} / {concert.max_boletos}
	</p>

	<hr />

	<h4>Buy Tickets</h4>

	<input placeholder="Buyer name" bind:value={name} />
	<input type="number" min="1" bind:value={qty} />

	<button on:click={buy} disabled={buying}>
		{buying ? "Processing..." : "Buy"}
	</button>

	<button class="secondary" on:click={loadTickets}>
		{showTickets ? "Hide Tickets" : "View Tickets"}
	</button>

	{#if message}
		<p style="color:#4ade80;">{message}</p>
	{/if}

	{#if error}
		<p style="color:#f87171;">{error}</p>
	{/if}

	{#if showTickets}
		{#if tickets.length === 0}
			<p>No tickets yet.</p>
		{:else}
			{#each tickets as t}
				<div class="ticket">
					{t.comprador} — {t.cantidad} tickets
				</div>
			{/each}
		{/if}
	{/if}
</div>