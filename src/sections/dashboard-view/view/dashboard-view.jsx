import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useSettingsContext } from 'src/components/settings';
import DashboardCount from '../dashboard-compony-count';
import { useGetService } from '../../../api/service';
import { useGetContract } from '../../../api/amc';
import { useGetAssete } from '../../../api/assets';

export default function DashboardView() {
  const theme = useTheme();
  const {serviceLength} = useGetService()
  const {contractLength} = useGetContract()
  const {assetsLength} = useGetAssete()
  const settings = useSettingsContext();



  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <DashboardCount
            title='Assets'
            total={assetsLength}
            icon={<img alt='icon' src='/assets/icons/glass/ic_glass_bag.png' />}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <DashboardCount
            title='Services'
            total={serviceLength}
            color='warning'
            icon={<img alt='icon' src='/assets/icons/glass/ic_glass_buy.png' />}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <DashboardCount
            title='Contracts'
            total={contractLength}
            color='error'
            icon={<img alt='icon' src='/assets/icons/glass/ic_glass_message.png' />}
          />
        </Grid>

        {/*<Grid xs={12} md={8}>*/}
        {/*  <Stack spacing={3}>*/}
        {/*    <DashboardDemoInquiryChart*/}
        {/*      title='Visits & Inquiry'*/}
        {/*      setSeriesData={setSeriesData}*/}
        {/*      seriesData={seriesData}*/}
        {/*      chart={{*/}
        {/*        categories,*/}
        {/*        series: [*/}
        {/*          {*/}
        {/*            type: 'Week',*/}
        {/*            data: [*/}
        {/*              {*/}
        {/*                name: 'Inquiry',*/}
        {/*                data: inquiry.weekWiseInquiries,*/}
        {/*              },*/}
        {/*              {*/}
        {/*                name: 'Visits',*/}
        {/*                data: visit.weekWiseVisits,*/}
        {/*              },*/}
        {/*            ],*/}
        {/*          },*/}
        {/*          {*/}
        {/*            type: 'Month',*/}
        {/*            data: [*/}
        {/*              {*/}
        {/*                name: 'Inquiry',*/}
        {/*                data: inquiry.monthWiseInquiries,*/}
        {/*              },*/}
        {/*              {*/}
        {/*                name: 'Visits',*/}
        {/*                data: visit?.monthWiseVisits,*/}
        {/*              },*/}
        {/*            ],*/}
        {/*          },*/}
        {/*          {*/}
        {/*            type: 'Year',*/}
        {/*            data: [*/}
        {/*              {*/}
        {/*                name: 'Inquiry',*/}
        {/*                data: inquiry.yearWiseInquiries,*/}
        {/*              },*/}
        {/*              {*/}
        {/*                name: 'Visits',*/}
        {/*                data: visit.yearWiseVisits,*/}
        {/*              },*/}
        {/*            ],*/}
        {/*          },*/}
        {/*        ],*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </Stack>*/}
        {/*</Grid>*/}
        {/*<Grid xs={12} md={4}>*/}
        {/*  <Stack spacing={3}>*/}
        {/*    <DashboardAttendenceChart*/}
        {/*      title="Today's Attendance"*/}
        {/*      total={parseInt(dashboardData?.students)}*/}
        {/*      chart={{*/}
        {/*        series: [*/}
        {/*          {*/}
        {/*            label: 'Present',*/}
        {/*            value: attendence?.present == 0 ? 0 : attendence?.present || 0,*/}
        {/*          },*/}
        {/*          { label: 'Late', value: attendence?.late == 0 ? 0 : attendence?.late || 0 },*/}
        {/*          { label: 'Absent', value: attendence?.absent == 0 ? 0 : attendence?.absent || 0 },*/}
        {/*        ],*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </Stack>*/}
        {/*</Grid>*/}
        {/*<Grid xs={12} md={4}>*/}
        {/*  <Stack spacing={3}>*/}
        {/*    <DashboardUpcomingDemo*/}
        {/*      title='Upcoming Demos'*/}
        {/*      subheader={`You have ${demo.length} demos`}*/}
        {/*      list={demo.slice(-5)}*/}
        {/*    />*/}
        {/*  </Stack>*/}
        {/*</Grid>*/}
        {/*<Grid xs={12} md={8}>*/}
        {/*  <Stack spacing={3}>*/}
        {/*    <DashboardCourseChart*/}
        {/*      title='Courses analytics'*/}
        {/*      chart={{*/}
        {/*        series: output,*/}
        {/*        colors: [*/}
        {/*          theme.palette.primary.main,*/}
        {/*          theme.palette.warning.dark,*/}
        {/*          theme.palette.success.darker,*/}
        {/*          theme.palette.error.main,*/}
        {/*          theme.palette.info.dark,*/}
        {/*          theme.palette.info.darker,*/}
        {/*          theme.palette.success.main,*/}
        {/*          theme.palette.warning.main,*/}
        {/*          theme.palette.info.main,*/}
        {/*        ],*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </Stack>*/}
        {/*</Grid>*/}
      </Grid>
    </Container>
  );
}
