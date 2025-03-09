export interface MessageInterface {
	role: string;
	content: string;
}

export interface OptionsInterface {
	num_keep?: number;
	seed?: number;
	num_predict?: number;
	top_k?: number;
	top_p?: number;
	tfs_z?: number;
	typical_p?: number;
	repeat_last_n?: number;
	temperature?: number;
	repeat_penalty?: number;
	presence_penalty?: number;
	frequency_penalty?: number;
	mirostat?: number;
	mirostat_tau?: number;
	mirostat_eta?: number;
	penalize_newline?: boolean;
	// stop: Sequence[str]
}

export interface ChatResponseInterface {
	model: string;
	created_at: string;
	response: {
		content: string;
	};
	message: string;
	done_reason: string;
	done: boolean;
	total_duration: number;
	load_duration: number;
	prompt_eval_count: number;
	prompt_eval_duration: number;
	eval_count: number;
	eval_duration: number;
}
