class ExecuteOnce {
    private isExecuted = false;

    public call(callback: () => void): void {
        if (!this.isExecuted) {
            callback();
            this.isExecuted = true;
        }
    }
}

export default ExecuteOnce;
