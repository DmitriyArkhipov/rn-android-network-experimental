import { type GetResponseByPath } from '../api-utils.types';

export type GetJobSearchChecklistResponse = GetResponseByPath<'/v1/checklists/job_search'>;

export type JobSearchChecklistBlock = GetJobSearchChecklistResponse['checklist'][number];

export type JobSearchChecklistBlockId = JobSearchChecklistBlock['name'];

export type JobSearchChecklistField = JobSearchChecklistBlock['fields'][number];

export type JobSearchChecklistFieldId = JobSearchChecklistField['id'];

export type JobSearchChecklistFieldStatus = JobSearchChecklistField['status'];
