export const formatCPF = (cpf: string) => {
	// Remove all non-numeric characters
	const cleanedCpf = cpf.replace(/\D/g, '');

	// Add formatting (XXX.XXX.XXX-XX)
	if (cleanedCpf.length <= 3) {
		return cleanedCpf;
	}
	if (cleanedCpf.length <= 6) {
		return `${cleanedCpf.slice(0, 3)}.${cleanedCpf.slice(3)}`;
	}
	if (cleanedCpf.length <= 9) {
		return `${cleanedCpf.slice(0, 3)}.${cleanedCpf.slice(
			3,
			6
		)}.${cleanedCpf.slice(6)}`;
	}
	return `${cleanedCpf.slice(0, 3)}.${cleanedCpf.slice(
		3,
		6
	)}.${cleanedCpf.slice(6, 9)}-${cleanedCpf.slice(9, 11)}`;
};

export const isValidCPF = (cpf: string) => {
	const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
	return cpfRegex.test(cpf);
};
