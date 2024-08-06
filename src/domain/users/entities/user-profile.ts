export type UserProfile = {
	firstName?: string;
	lastName?: string;
	knownBy?: string;
	dateOfBirth?: Date;
	telephoneNumber?: string;
	metadata?: {
		ftuxComplete: boolean;
	} | null;
};
