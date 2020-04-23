export default class ValidationResult<T> {
    constructor(data: T) {
        this.Data = data;
        this.IsSuccess = true;
        this.Errors = [];
    }

    Data: T;
    IsSuccess: boolean;
    Errors: string[];
}