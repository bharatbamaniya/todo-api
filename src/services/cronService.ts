import cron from 'node-cron';
import todoService from './todoService'; // Assuming you have a todoService

// Schedule the job to run every day at midnight
const cronExpression: string = '0 0 * * *'; //(0 minute, 0 hours, every day, every month, every year)
const cronName: string = 'update-status-of-expired-todos';

class CronService {
    private static instance: CronService;
    private cronJob: any;

    private constructor() {
        // Check if a cron job is already running

        if (!this.cronJob) {
            console.log('!IMPORTANT :: Cron job \'' + cronName + '\' scheduled at', cronExpression);

            cron.schedule(cronExpression, async () => {
                try {
                    await todoService.updateExpiredTodos();
                    console.log(new Date(), 'Cron job executed successfully.');
                } catch (error) {
                    console.error('Error executing cron job:', error);
                }
            }, {name: cronName});
        }
    }

    public static getInstance(): CronService {
        if (!CronService.instance) {
            CronService.instance = new CronService();
        }
        return CronService.instance;
    }
}

export default CronService;