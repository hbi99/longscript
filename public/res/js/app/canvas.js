
sys.app.canvas = {
	info: {},
	mouseState: {},
	init: function() {
		var _sys = sys,
			observer = _sys.observer;

		observer.on('app.resize', this.doEvent);
		observer.on('file_loaded', this.doEvent);
		observer.on('assets_loaded', this.doEvent);
		observer.on('nob_zoom', this.doEvent);
		observer.on('nob_opacity', this.doEvent);

		this.cvs = _sys.el.cvs;
		this.ctx = this.cvs.getContext('2d');

		this.ballCvs = document.createElement('canvas');
		this.ballCtx = this.ballCvs.getContext('2d');

		this.ballCvs.width  =
		this.cvs.width      = this.cvs.offsetWidth;
		this.ballCvs.height =
		this.cvs.height     = this.cvs.offsetHeight;

		this.dim = getDim(this.cvs);

		this.info = {
			mode: 'design',
			scale: 1,
			origoX: 0,
			origoY: 0,
			frameIndex: 0
			//, sequence: [[[177.18,1.41,1.5]],[[178.78,3.01,2.75]],[[179.98,4.61,3.5]],[[181.38,6.41,3.75]],[[182.78,8.01,3.75]],[[184.18,9.81,3.75]],[[187.58,10.61,2.75],[184.38,12.61,2.75]],[[188.78,12.21,2.75],[185.18,13.81,2.75]],[[190.38,13.61,2.75],[185.78,15.41,2.75]],[[191.38,14.81,2.75],[186.38,17.01,2.75]],[[192.38,16.61,2.75],[187.18,18.21,2.75]],[[193.78,18.21,2.75],[187.78,19.61,2.75]],[[194.78,20.21,2.75],[188.38,21.21,2.75]],[[196.18,21.81,2.75],[188.98,22.81,2.75]],[[197.38,23.41,2.75],[189.78,24.61,2.75]],[[198.58,26.01,2.75],[190.38,26.41,2.75]],[[199.98,28.21,2.75],[190.98,28.01,2.75]],[[201.38,30.81,2.75],[191.38,29.41,2.75]],[[202.38,33.21,2.75],[191.98,31.21,2.75]],[[203.38,35.61,2.75],[192.58,33.21,2.75]],[[204.18,37.61,2.75],[192.98,35.21,2.75]],[[205.18,39.61,2.75],[193.18,37.41,2.75]],[[205.78,41.81,2.75],[193.58,39.21,2.75]],[[206.38,43.61,2.75],[193.38,41.81,2.75]],[[206.98,45.61,2.75],[193.78,44.01,2.75]],[[207.18,47.41,2.75],[193.98,46.41,2.75]],[[207.78,49.41,2.75],[193.98,48.81,2.75]],[[208.18,51.41,2.75],[193.78,51.21,2.75]],[[208.18,53.61,2.75],[193.58,53.61,2.75]],[[208.78,55.61,2.75],[193.38,56.01,2.75]],[[208.58,58.01,2.75],[193.38,58.01,2.75]],[[208.58,60.61,2.75],[192.98,60.41,2.75]],[[208.38,63.01,2.75],[192.38,62.81,2.75]],[[207.98,65.21,2.75],[191.78,65.01,2.75]],[[207.98,67.41,2.75],[191.38,67.61,2.75]],[[207.58,69.41,2.75],[190.58,69.61,2.75]],[[207.58,70.81,2.75],[189.78,71.81,2.75]],[[206.18,73.81,2.75],[188.58,74.41,2.75]],[[208.18,74.01,2.75],[187.78,76.61,2.75]],[[209.78,73.61,2.75],[186.98,78.81,2.75]],[[211.78,73.41,2.75],[185.98,80.81,2.75]],[[213.58,72.81,2.75],[183.78,81.61,2.75]],[[215.38,72.41,2.75],[180.98,80.81,2.75]],[[217.58,72.41,2.75],[180.58,83.21,2.75]],[[219.38,72.01,2.75],[180.18,85.81,2.75]],[[221.38,71.41,2.75],[179.38,87.41,2.75]],[[223.38,71.01,2.75],[178.78,90.01,2.75]],[[225.58,70.81,2.75],[178.18,92.21,2.75]],[[227.78,70.41,2.75],[176.58,95.01,2.75]],[[229.78,70.01,2.75],[175.18,96.81,2.75]],[[232.18,69.61,2.75],[173.58,99.21,2.75]],[[233.98,69.21,2.75],[172.18,101.21,2.75]],[[235.98,69.01,2.75],[170.18,103.01,2.75]],[[238.38,68.61,2.75],[168.18,104.81,2.75]],[[240.78,68.41,2.75],[166.18,106.61,2.75]],[[242.78,68.21,2.75],[163.98,108.61,2.75]],[[244.78,68.01,2.75],[161.38,110.61,2.75]],[[246.98,67.61,2.75],[159.58,112.01,2.75]],[[249.58,67.21,2.75],[157.58,113.81,2.75]],[[251.98,66.81,2.75],[160.78,112.61,2.75]],[[253.98,66.81,2.75],[163.58,111.21,2.75]],[[255.98,66.81,2.75],[166.18,111.61,2.75]],[[258.38,66.61,2.75],[164.58,114.01,2.75]],[[260.38,66.61,2.75],[162.78,116.21,2.75]],[[262.18,66.41,2.75],[161.58,118.21,2.75]],[[265.18,66.41,2.75],[160.18,119.81,2.75]],[[267.78,66.21,2.75],[158.58,122.21,2.75]],[[270.38,66.41,2.75],[157.18,124.01,2.75]],[[272.58,66.41,2.75],[156.01,125.35,2.75]],[[275.58,66.41,2.75],[154.33,127.03,2.75]],[[277.98,66.81,2.75],[152.89,129.44,2.75]],[[280.18,67.21,2.75],[151.21,131.36,2.75]],[[282.38,67.61,2.75],[150,133.04,2.75]],[[284.78,68.01,2.75],[148.8,134.97,2.75]],[[286.98,69.01,2.75],[147.36,136.89,2.75]],[[288.98,70.41,2.75],[145.92,138.81,2.75]],[[290.58,71.21,2.75],[144.48,140.49,2.75]],[[292.18,72.41,2.75],[143.51,142.66,2.75]],[[293.38,74.21,2.75],[142.31,144.58,2.75]],[[293.78,75.81,2.75],[141.11,146.99,2.75]],[[293.98,77.81,2.75],[139.43,148.91,2.75]],[[293.98,80.01,2.75],[138.23,151.07,2.75]],[[293.78,82.61,2.75],[136.78,153.72,2.75]],[[293.38,84.41,2.75],[135.34,156.36,2.75]],[[292.18,86.21,2.75],[134.38,158.52,2.75]],[[290.58,88.21,2.75],[133.56,160.71,2.75]],[[289.38,90.41,2.75],[132.48,162.88,2.75]],[[288.18,91.61,2.75],[131.39,165.33,2.75]],[[286.38,93.61,2.75],[130.3,168.04,2.75]],[[284.18,95.81,2.75],[129.49,170.49,2.75]],[[282.18,97.61,2.75],[129.22,172.94,2.75]],[[280.58,99.41,2.75],[128.67,175.11,2.75]],[[278.98,100.81,2.75],[127.59,177.83,2.75]],[[277.38,102.41,2.75],[126.77,179.73,2.75]],[[275.58,103.61,2.75],[126.77,181.9,2.75]],[[273.58,105.61,2.75],[126.05,184.14,2.75]],[[271.58,107.01,2.75],[126.39,186.57,2.75]],[[269.38,108.01,2.75],[125.7,189.35,2.75]],[[267.38,109.81,2.75],[125.7,191.78,2.75]],[[265.38,111.01,2.75],[125.35,194.9,2.75]],[[263.38,112.41,2.75],[124.66,197.68,2.75]],[[261.58,113.61,2.75],[124.31,200.8,2.75]],[[259.78,115.01,2.75],[124.31,203.58,2.75]],[[257.98,116.21,2.75],[124.31,206.36,2.75]],[[255.78,117.21,2.75],[124.66,208.1,2.75]],[[253.98,118.81,2.75],[125.35,210.87,2.75]],[[251.78,120.21,2.75],[123.96,212.96,2.75]],[[249.38,121.01,2.75],[121.19,212.61,2.75]],[[247.38,122.61,2.75],[118.41,212.61,2.75]],[[244.58,123.41,2.75],[115.28,212.26,2.75]],[[242.78,124.61,2.75],[112.5,212.61,2.75]],[[240.98,125.61,2.75],[109.03,212.61,2.75]],[[238.98,126.81,2.75],[105.56,211.92,2.75]],[[236.78,127.81,2.75],[102.44,212.26,2.75]],[[234.78,129.21,2.75],[99.31,211.92,2.75]],[[232.98,129.81,2.75],[96.53,211.57,2.75]],[[231.38,130.81,2.75],[93.75,211.92,2.75]],[[229.78,131.21,2.75],[90.28,211.92,2.75]],[[227.58,131.81,2.75],[90.28,208.44,2.75]],[[225.58,132.81,2.75],[90.29,205.67,2.75]],[[224.18,134.01,2.75],[90.28,202.54,2.75]],[[227.18,134.21,2.75],[91.32,199.42,2.75]],[[230.38,133.61,2.75],[91.67,196.29,2.75]],[[233.18,132.61,2.75],[92.37,193.51,2.75]],[[235.38,132.41,2.75],[93.06,190.39,2.75]],[[237.18,131.41,2.75],[94.45,187.96,2.75]],[[239.38,131.81,2.75],[95.49,184.83,2.75]],[[241.18,131.61,2.75],[96.88,182.05,2.75]],[[243.18,131.61,2.75],[97.92,179.28,2.75]],[[245.18,131.21,2.75],[99.66,176.15,2.75]],[[248.38,130.81,2.75],[101.39,173.03,2.75]],[[250.98,130.81,2.75],[103.48,170.25,2.75]],[[253.38,130.81,2.75],[105.21,167.12,2.75]],[[255.78,130.81,2.75],[106.95,164,2.75]],[[258.58,130.81,2.75],[109.03,161.22,2.75]],[[260.98,130.81,2.75],[111.46,158.44,2.75]],[[263.18,131.41,2.75],[113.55,156.01,2.75]],[[265.58,131.61,2.75],[115.63,152.54,2.75]],[[268.18,132.21,2.75],[118.41,150.11,2.75]],[[270.58,132.61,2.75],[119.8,148.03,2.75]],[[272.78,133.81,2.75],[121.53,145.6,2.75]],[[274.78,134.81,2.75],[123.96,142.82,2.75]],[[275.78,135.81,2.75],[126.05,140.74,2.75]],[[276.78,136.81,2.75],[128.13,137.96,2.75]],[[277.98,138.61,2.75],[130.56,135.53,2.75]],[[278.78,140.21,2.75],[132.3,132.4,2.75]],[[279.18,142.41,2.75],[134.73,129.62,2.75]],[[279.38,144.41,2.75],[136.46,127.19,2.75]],[[278.98,146.81,2.75],[138.2,124.42,2.75]],[[278.38,148.81,2.75],[140.28,121.29,2.75]],[[277.38,151.01,2.75],[142.37,118.51,2.75]],[[275.78,153.21,2.75],[144.1,115.74,2.75]],[[274.18,155.61,2.75],[146.19,112.61,2.75]],[[272.78,157.21,2.75],[147.57,109.14,2.75]],[[270.78,159.41,2.75],[149.31,106.36,2.75]],[[268.78,161.61,2.75],[151.05,102.89,2.75]],[[266.38,164.01,2.75],[152.09,99.07,2.75]],[[264.98,165.61,2.75],[153.48,95.94,2.75]],[[262.58,167.21,2.75],[154.52,92.82,2.75]],[[260.38,169.21,2.75],[154.87,89.35,2.75]],[[257.98,171.01,2.75],[155.21,85.87,2.75]],[[255.98,172.81,2.75],[155.21,82.05,2.75]],[[253.78,174.41,2.75],[154.52,78.58,2.75]],[[251.78,175.61,2.75],[152.78,75.11,2.75]],[[249.78,177.61,2.75],[150.7,71.99,2.75]],[[247.78,178.61,2.75],[147.92,69.9,2.75]],[[245.38,180.21,2.75],[144.1,67.82,2.75]],[[243.18,181.81,2.75],[140.98,67.12,2.75]],[[240.78,183.21,2.75],[137.85,65.74,2.75]],[[238.18,185.01,2.75],[135.07,64.35,2.75]],[[235.78,186.81,2.75],[131.6,64.35,2.75]],[[232.98,188.41,2.75],[127.78,64,2.75]],[[230.78,189.81,2.75],[124.31,64.35,2.75]],[[228.38,190.81,2.75],[121.19,64,2.75]],[[226.18,192.41,2.75],[117.37,63.65,2.75]],[[223.98,193.61,2.75],[114.59,64,2.75]],[[221.98,195.01,2.75],[111.12,64.69,2.75]],[[219.58,196.21,2.75],[107.99,65.04,2.75]],[[217.18,197.81,2.75],[104.52,65.04,2.75]],[[214.58,198.81,2.75],[101.39,65.39,2.75]],[[212.38,200.21,2.75],[97.92,65.74,2.75]],[[209.98,201.61,2.75],[94.45,66.78,2.75]],[[207.18,203.01,2.75],[90.63,67.12,2.75]],[[204.78,204.41,2.75],[87.85,67.82,2.75]],[[202.78,205.41,2.75],[84.03,68.17,2.75]],[[200.58,206.41,2.75],[81.95,69.21,2.75]],[[198.38,207.61,2.75],[78.82,69.55,2.75]],[[195.78,208.81,2.75],[79.17,71.64,2.75]],[[193.58,210.01,2.75],[80.21,74.42,2.75]],[[190.98,211.41,2.75],[80.56,77.54,2.75]],[[188.58,212.61,2.75],[80.21,80.32,2.75]],[[185.78,213.21,2.75],[79.52,83.1,2.75]],[[183.18,214.41,2.75],[78.13,85.53,2.75]],[[183.78,215.81,2.75],[77.09,88.3,2.75]],[[184.18,216.41,3.55],[75.35,90.39,2.75]],[[185.38,218.21,3.55],[73.27,92.82,2.75]],[[186.78,220.01,3.55],[71.19,94.9,2.75]],[[188.98,221.41,2.75],[68.75,97.33,2.75]],[[190.78,222.81,2.75],[65.98,99.42,2.75]],[[192.38,224.41,2.75],[63.55,101.5,2.75]],[[193.58,226.21,2.75],[60.07,103.24,2.75]],[[194.78,227.61,2.75],[57.64,105.32,2.75]],[[196.98,229.21,2.75],[54.87,107.4,2.75]],[[198.58,231.41,2.75],[52.09,109.14,2.75]],[[199.58,233.41,2.75],[49.31,111.22,2.75]],[[201.58,234.81,2.75],[51.74,111.57,2.75]],[[202.38,236.81,2.75],[55.21,109.83,2.75]],[[204.18,238.61,2.75],[58.69,108.79,2.75]],[[205.18,240.61,2.75],[62.16,107.75,2.75]],[[206.38,242.61,2.75],[63.89,106.71,2.75]],[[206.98,244.41,2.75],[66.67,106.71,2.75]],[[207.98,246.41,2.75],[70.14,106.01,2.75]],[[208.78,249.01,2.75],[73.62,105.32,2.75]],[[209.98,251.01,2.75],[77.09,103.93,2.75]],[[211.18,254.21,2.75],[80.91,103.58,2.75]],[[211.58,256.01,2.75],[84.38,103.24,2.75]],[[212.38,258.21,2.75],[87.51,102.89,2.75]],[[212.98,260.41,2.75],[90.98,102.54,2.75]],[[213.18,262.01,2.75],[94.45,102.54,2.75]],[[213.58,263.81,2.75],[97.92,102.19,2.75]],[[213.58,266.01,2.75],[101.05,102.54,2.75]],[[213.78,268.61,2.75],[103.82,102.54,2.75]],[[213.78,271.21,2.75],[106.95,103.58,2.75]],[[213.78,274.21,2.75],[110.07,103.24,2.75]],[[213.78,276.61,2.75],[113.2,104.97,2.75]],[[213.18,279.01,2.75],[115.63,107.05,2.75]],[[212.78,281.61,2.75],[117.02,109.49,2.75]],[[212.38,284.21,2.75],[118.06,111.57,2.75]],[[211.58,286.41,2.75],[118.41,114.69,2.75]],[[211.38,289.01,2.75],[118.06,117.82,2.75]],[[210.58,291.21,2.75],[118.06,120.6,2.75]],[[209.98,293.61,2.75],[116.67,123.72,2.75]],[[208.98,295.81,2.75],[115.98,126.15,2.75]],[[208.38,297.61,2.75],[114.59,129.28,2.75]],[[207.38,299.61,2.75],[113.2,132.05,2.75]],[[206.78,302.21,2.75],[111.81,134.49,2.75]],[[205.98,304.01,2.75],[110.07,136.92,2.75]],[[204.78,305.81,2.75],[108.34,139.35,2.75]],[[203.98,308.01,2.75],[106.6,141.43,2.75]],[[202.58,310.21,2.75],[105.21,143.86,2.75]],[[201.38,312.41,2.75],[103.13,146.29,2.75]],[[200.18,314.41,2.75],[101.05,149.07,2.75]],[[198.78,316.01,2.75],[98.62,151.15,2.75]],[[197.78,317.21,2.75],[97.23,153.58,2.75]],[[196.38,318.41,2.75],[95.14,156.36,2.75]],[[195.78,319.81,2.75],[93.06,158.1,2.75]],[[194.18,321.01,2.75],[91.32,160.18,2.75]],[[194.78,317.41,2.75],[89.24,162.61,2.75]],[[196.58,314.81,2.75],[86.12,165.39,2.75]],[[197.78,313.01,2.75],[85.42,167.47,2.75]],[[198.38,310.61,2.75],[82.99,169.9,2.75]],[[198.98,309.01,2.75],[81.25,172.33,2.75]],[[199.38,307.41,2.75],[79.52,174.76,2.75]],[[199.78,305.21,2.75],[77.44,176.85,2.75]],[[200.18,303.81,2.75],[75.35,179.28,2.75]],[[200.78,302.21,2.75],[73.62,181.71,2.75]],[[200.98,300.41,2.75],[71.88,184.49,2.75]],[[201.58,298.81,2.75],[69.45,187.26,2.75]],[[201.78,297.21,2.75],[67.37,190.39,2.75]],[[202.38,295.81,2.75],[65.63,193.17,2.75]],[[202.38,294.21,2.75],[64.24,195.6,2.75]],[[202.58,292.21,2.75],[62.5,198.03,2.75]],[[202.98,290.41,2.75],[61.46,200.8,2.75]],[[203.38,288.61,2.75],[60.77,203.24,2.75]],[[203.78,286.81,2.75],[60.07,204.97,2.75]],[[203.78,284.81,2.75],[57.99,207.05,2.75]],[[203.78,282.81,2.75],[53.82,207.4,2.75]],[[204.38,281.21,2.75],[50.7,207.05,2.75]],[[204.38,279.01,2.75],[47.92,206.71,2.75]],[[204.38,277.01,2.75],[44.8,205.67,2.75]],[[204.58,275.21,2.75],[41.67,204.62,2.75]],[[204.38,273.01,2.75],[38.89,203.93,2.75]],[[204.38,271.21,2.75],[37.5,204.62,2.75]],[[204.18,269.01,2.75],[37.85,207.4,2.75]],[[203.78,266.01,2.75],[37.85,209.83,2.75]],[[203.38,263.61,2.75],[37.85,212.26,2.75]],[[202.38,261.81,2.75],[36.81,215.04,2.75]],[[201.58,259.61,2.75],[34.73,217.47,2.75]],[[199.98,257.61,2.75],[32.64,219.9,2.75]],[[198.58,255.61,2.75],[29.52,221.29,2.75]],[[196.98,254.21,2.75],[27.44,223.03,2.75]],[[195.38,252.61,2.75],[24.66,224.42,2.75]],[[192.98,251.21,2.75],[21.53,225.8,2.75]],[[190.98,250.21,2.75],[18.06,226.85,2.75]],[[188.98,249.01,2.75],[14.24,227.89,2.75]],[[186.58,247.81,2.75],[11.14,228.91,2.75]],[[183.98,247.21,2.75],[7.35,229.62,2.75]],[[181.58,246.61,2.75],[4.23,230.26,2.75]],[[178.78,246.21,2.75],[1.29,231.73,2.75]],[[176.78,246.01,2.75],[4.97,232.46,2.75]],[[174.18,246.41,2.75],[8.28,232.1,2.75]],[[171.78,247.21,2.75],[11.95,231.73,2.75]],[[169.38,247.81,2.75],[15.26,232.83,2.75]],[[166.98,248.61,2.75],[18.2,232.83,2.75]],[[165.18,249.41,2.75],[21.14,233.2,2.75]],[[163.58,250.41,2.75],[24.82,233.2,2.75]],[[161.78,251.61,2.75],[27.76,233.2,2.75]],[[159.78,253.01,2.75],[30.7,233.57,2.75]],[[157.78,254.81,2.75],[32.54,234.3,2.75]],[[156.18,256.61,2.75],[35.85,233.93,2.75]],[[154.58,258.01,2.75],[37.69,233.93,2.75]],[[153.18,260.01,2.75],[39.53,233.57,2.75]],[[151.58,263.81,2.75],[41.73,233.57,2.75]],[[149.78,261.61,2.75],[43.94,233.93,2.75]],[[147.38,259.61,2.75],[46.14,234.3,2.75]],[[145.98,258.21,2.75],[47.98,233.57,2.75]],[[144.38,255.81,2.75],[49.09,235.04,2.75]],[[142.38,253.41,2.75],[48.35,236.88,2.75]],[[140.38,250.81,2.75],[48.72,239.45,2.75]],[[138.78,248.81,2.75],[48.72,242.02,2.75]],[[137.58,246.61,2.75],[48.4,244.93,2.75]],[[135.58,244.61,2.75],[48.4,247.37,2.75]],[[134.18,242.41,2.75],[49.28,249.63,2.75]],[[133.38,240.61,2.75],[49.76,252.03,2.75]],[[131.78,238.21,2.75],[49.76,254.44,2.75]],[[130.78,236.01,2.75],[51.21,257.8,2.75]],[[129.18,233.41,2.75],[51.69,260.69,2.75]],[[128.58,230.41,2.75],[52.17,262.61,2.75]],[[126.38,228.81,2.75],[53.61,265.01,2.75]],[[123.38,228.81,2.75],[54.57,268.38,2.75]],[[121.18,229.21,2.75],[55.05,271.26,2.75]],[[118.58,229.81,2.75],[56.98,274.15,2.75]],[[116.18,229.81,2.75],[58.9,277.03,2.75]],[[113.38,230.61,2.75],[60.34,279.44,2.75]],[[110.98,230.41,2.75],[62.75,281.36,2.75]],[[108.78,230.41,2.75],[63.71,284.24,2.75]],[[105.78,230.41,2.75],[65.15,286.17,2.75]],[[103.58,230.81,2.75],[67.55,288.09,2.75]],[[101.18,231.01,2.75],[69.96,290.49,2.75]],[[98.78,231.01,2.75],[70.92,292.42,2.75]],[[95.98,231.01,2.75],[73.8,294.34,2.75]],[[96.58,232.61,2.75],[76.21,296.74,2.75]],[[96.98,234.01,2.75],[78.61,298.67,2.75]],[[97.78,235.61,2.75],[81.5,300.59,2.75]],[[98.98,237.21,2.75],[83.42,302.51,2.75]],[[99.98,239.41,2.75],[85.34,303.48,2.75]],[[101.38,241.01,2.75],[87.26,304.92,2.75]],[[102.38,242.41,2.75],[89.67,305.88,2.75]],[[103.98,244.21,2.75],[92.07,307.32,2.75]],[[104.98,245.61,2.75],[93.99,308.28,2.75]],[[106.38,247.41,2.75],[96.4,308.76,2.75]],[[108.38,249.21,2.75],[98.32,309.73,2.75]],[[109.78,251.01,2.75],[100.25,310.69,2.75]],[[110.98,253.21,2.75],[102.17,311.65,2.75]],[[108.38,252.61,2.75],[105.05,312.61,2.75]],[[106.38,253.21,2.75],[106.5,314.05,2.75]],[[104.18,252.81,2.75],[108.42,315.01,2.75]],[[101.78,252.81,2.75],[195.92,103.96,2.75]],[[99.58,253.21,2.75],[198.8,102.99,2.75]],[[97.18,253.21,2.75],[201.69,102.51,2.75]],[[94.38,253.81,2.75],[205.05,102.03,2.75]],[[91.78,254.61,2.75],[208.04,100.78,2.75]],[[89.58,255.21,2.75],[211.8,100.78,2.75]],[[86.98,256.01,2.75],[214.49,99.44,2.75]],[[84.78,257.41,2.75],[217.98,98.63,2.75]],[[82.58,258.81,2.75],[221.21,98.09,2.75]],[[80.58,260.41,2.75],[224.16,97.83,2.75]],[[79.38,262.01,2.75],[227.39,97.29,2.75]],[[78.78,263.61,2.75],[230.62,97.02,2.75]],[[77.98,265.41,2.75],[233.84,96.21,2.75]],[[77.58,266.81,2.75],[236.8,95.67,2.75]],[[76.78,268.81,2.75],[240.29,95.67,2.75]],[[76.98,270.41,2.75],[243.52,94.87,2.75]],[[76.38,272.41,2.75],[246.48,95.14,2.75]],[[76.38,274.81,2.75],[249.43,94.6,2.75]],[[77.18,277.41,2.75],[252.39,95.14,2.75]],[[77.18,278.81,2.75],[254.81,95.67,2.75]],[[77.98,280.61,2.75],[255.89,97.83,2.75]],[[78.58,283.01,2.75],[255.08,100.51,2.75]],[[79.78,284.61,2.75],[253.2,102.39,2.75]],[[80.38,286.21,2.75],[250.78,104.01,2.75]],[[81.38,288.21,2.75],[248.63,106.16,2.75]],[[82.58,290.21,2.75],[246.21,108.04,2.75]],[[83.78,291.41,2.75],[243.52,109.38,2.75]],[[84.38,293.41,2.75],[241.1,111.27,2.75]],[[85.78,294.41,2.75],[238.41,112.88,2.75]],[[87.38,296.21,2.75],[235.99,114.22,2.75]],[[88.58,297.41,2.75],[233.57,115.84,2.75]],[[89.98,299.01,2.75],[230.89,117.45,2.75]],[[91.58,300.61,2.75],[227.66,118.79,2.75]],[[93.18,302.21,2.75],[224.43,119.87,2.75]],[[94.78,303.61,2.75],[222.01,121.75,2.75]],[[96.78,304.81,2.75],[219.6,123.09,2.75]],[[98.58,306.21,2.75],[216.1,124.17,2.75]],[[99.78,307.81,2.75],[213.41,125.78,2.75]],[[101.38,308.81,2.75],[210.72,127.13,2.75]],[[102.58,310.01,2.75],[208.3,128.74,2.75]],[[104.18,311.41,2.75],[205.62,129.55,2.75]],[[105.38,312.61,3.35],[202.66,130.62,2.75]],[[106.78,313.81,3.35],[200.24,132.5,2.75]],[[108.58,314.21,3.35],[196.75,133.58,2.75]],[[170.15,157.87,2.75],[193.52,134.65,2.75]],[[172.35,157.87,2.75],[190.52,136.05,2.75]],[[175.55,157.07,2.75],[187.72,137.45,2.75]],[[177.95,155.67,2.75],[185.12,138.65,2.75]],[[181.75,155.07,2.75],[182.72,139.45,2.75]],[[184.75,154.07,2.75],[180.72,140.65,2.75]],[[187.15,153.47,2.75],[178.72,141.45,2.75]],[[190.15,152.87,2.75],[176.32,142.25,2.75]],[[193.55,152.27,2.75],[173.72,143.05,2.75]],[[196.35,151.47,2.75],[174.52,140.45,2.75]],[[198.75,151.07,2.75],[175.52,138.25,2.75]],[[201.75,150.07,2.75],[177.12,136.05,2.75]],[[204.55,149.87,2.75],[178.52,133.45,2.75]],[[207.55,149.47,2.75],[179.32,131.05,2.75]],[[210.55,148.87,2.75],[180.12,128.65,2.75]],[[213.95,148.67,2.75],[181.12,126.25,2.75]],[[217.35,148.07,2.75],[182.52,124.65,2.75]],[[220.15,148.07,2.75],[183.12,122.45,2.75]],[[223.15,148.07,2.75],[184.32,120.25,2.75]],[[226.15,148.27,2.75],[185.72,118.25,2.75]],[[228.55,147.87,2.75],[187.12,115.65,2.75]],[[231.15,148.47,2.75],[188.32,114.05,2.75]],[[233.75,148.47,2.75],[189.12,112.85,2.75]],[[236.55,148.87,2.75],[190.52,110.65,2.75]],[[239.35,150.07,2.75],[191.52,108.25,2.75]],[[241.55,151.67,2.75],[193.32,105.85,2.75]],[[242.15,154.47,2.75]],[[241.75,156.67,2.75]],[[240.55,159.67,2.75]],[[238.75,162.07,2.75]],[[236.55,164.67,2.75]],[[234.55,166.87,2.75]],[[232.15,169.07,2.75]],[[229.75,171.87,2.75]],[[226.75,173.67,2.75]],[[224.15,175.87,2.75]],[[221.75,178.07,2.75]],[[218.55,179.67,2.75]],[[216.55,181.27,2.75]],[[213.75,182.67,2.75]],[[210.95,184.27,2.75]],[[208.35,186.07,2.75]],[[206.15,187.27,2.75]],[[203.55,188.47,2.75]],[[200.55,190.27,2.75]],[[197.55,191.47,2.75]],[[194.35,193.27,2.75]],[[191.35,195.07,2.75]],[[187.95,196.07,2.75]],[[184.55,197.47,2.75]],[[181.75,198.27,2.75]],[[178.75,199.67,2.75]],[[176.15,200.87,2.75]],[[172.55,202.27,2.75]],[[170.55,200.07,2.75]],[[169.75,197.27,2.75]],[[167.75,194.67,2.75]],[[167.15,192.47,2.75]],[[165.75,190.27,2.75]],[[164.95,188.27,2.75]],[[164.55,185.87,2.75]],[[163.55,182.87,2.75]],[[163.75,179.67,2.75]],[[163.75,176.47,2.75]],[[163.75,173.67,2.75]],[[163.75,171.27,2.75]],[[164.35,167.87,2.75]],[[165.55,165.27,2.75]],[[166.35,162.87,2.75]],[[167.35,160.07,2.75]],[[167.35,160.07,2.75]]]
		};

		jr(this.cvs).bind('mousedown selectstart mousemove', this.doEvent);
		jr(document).bind('mouseup', this.doEvent);

		//this.zoomEvents('focus');
	},
	doEvent: function(event, srcEl) {
		var _sys   = sys,
			_app   = _sys.app,
			_el    = _sys.el,
			_jr    = jr,
			self   = _app.canvas,
			info   = self.info,
			doc    = document,
			dim    = self.dim,
			type   = typeof(event) === 'string' ? event : event.type,
			mouseState,
			details,
			scale,
			sequence,
			frame,
			isCircle,
			mouseX,
			mouseY,
			origoX,
			origoY,
			percX,
			percY,
			ball,
			ballX,
			ballY,
			ballR,
			i, il,
			j, jl,
			k, kl;

		if (event.bubbles) {
			event.preventDefault();

			mouseX     = event.pageX - dim.l;
			mouseY     = event.pageY - dim.t;
			mouseState = self.mouseState;
			sequence   = info.sequence;
			frame      = sequence[info.frameIndex];

			if (!mouseState.type) {
				for (i=0, il=frame.length; i<il; i++) {
					ball = frame[i];
					ballX = ((info.iX + ball[0]) * info.scale) + info.origoX - mouseX;
					ballY = ((info.iY + ball[1]) * info.scale) + info.origoY - mouseY;
					ballR = ball[2] * info.scale;
					isCircle = Math.sqrt(Math.pow(ballX, 2) + Math.pow(ballY, 2)) <= ballR;
					/* debug purpose 
					self.ctx.globalCompositeOperation = 'source-over';
					self.ctx.fillStyle = 'rgb(255,0,0)';
					self.ctx.beginPath();
					self.ctx.arc(   ballX + mouseX,
									ballY + mouseY,
									ballR, 0, self.pi2, false);
					self.ctx.fill();
					*/
					if (isCircle) break;
				}
			}
		}
		switch(type) {
			// custom events
			case 'mode_design':
			case 'mode_preview':
				self.info.mode = type.split('_')[1];
				// update canvas
				self.updateBallCvs();
				self.draw();
				/* falls through */
			case 'mode_code':
				// update UI
				srcEl = _jr('li[data-cmd="cvs -s '+ type +'"]');
				srcEl.parent().find('.active').removeClass('active');
				srcEl.addClass('active');
				// update context menu
				var xMenu = _sys.ledger.selectNodes('//context//*[@radioId="viewMode"]');
				for (j=0, jl=xMenu.length; j<jl; j++) {
					if (xMenu[j].getAttribute('action') === 'cvs -s '+ type) xMenu[j].setAttribute('checked', 1);
					else xMenu[j].removeAttribute('checked');
				}
				if (type === 'mode_code') {
					_jr(_el.layout).addClass('code-mode');
					self.doEvent('prepare_codeview');
				} else {
					_jr(_el.layout).removeClass('code-mode');
					_app.timeline.doEvent('goto_frame', info.frameIndex);
				}
				break;
			case 'prepare_codeview':
				var code = _sys.fs.load({path: 'res/xml/html-template.txt'}).text,
					lines = code.replace(/</g, '&lt;').replace(/>/g, '&gt;').split('\n'),
					s = '<div class="line-numbers">';

				for (i=0; i<lines.length; i++) {
					// attributes
					lines[i] = lines[i].replace(/([\w-]+)="(.*?)"/g, '<span class="na">$1</span><span class="ipnct">="</span><span class="s">$2</span><span class="ipnct">"</span>');
					// html tags
					lines[i] = lines[i].replace(/(\&lt;[\w\d]+\&gt;|\&lt;\/[\w\d]+\&gt;|\&lt;[\w\d]+\/\&gt;)/g, '<span class="nt">$1</span>');
					lines[i] = lines[i].replace(/(\&lt;\w+ )(.*?)/g, '<span class="nt">$1</span>$2');
					lines[i] = lines[i].replace(/(\&lt;!\w+ )(\w+)/g, '<span class="nn">$1</span><span class="nt">$2</span>');
					// comments
					lines[i] = lines[i].replace(/(\&lt;!--.*?--\&gt;)/g, '<span class="c">$1</span>');
					lines[i] = lines[i].replace(/\&lt;\//g, '<span class="pnct">&lt;/</span>');
					lines[i] = lines[i].replace(/\&lt;/g, '<span class="pnct">&lt;</span>');
					lines[i] = lines[i].replace(/\&gt;/g, '<span class="pnct">&gt;</span>');
					// script
					lines[i] = lines[i].replace(/(\/\/.*)/g, '<span class="jsc">$1</span>');
					lines[i] = lines[i].replace(/(\&lt;!--.*?--\&gt;)/g, '<span class="jsc">$1</span>');
				}

				for (i=0; i<31; i++) {
					s += '<span>'+ (i+1) +'</span>';
				}
				s += '</div><pre>';
				s += lines.join('\n');
				s += '</pre>';
				_el.code_view.innerHTML = s;
				break;
			case 'app.resize':
				self.dim = getDim(self.cvs);
				self.ballCvs.width =
				self.cvs.width     = _el.canvas_bg.offsetWidth;
				self.ballCvs.height =
				self.cvs.height     = _el.canvas_bg.offsetHeight;
				self.draw();
				break;
			case 'file_loaded':
				if (_app.mode === 'font') {
					_el.canvasTitle.innerHTML = _app.fileMeta('name') +' [ '+ _app.assets.activeLetter +' ]';
				} else {
					_el.canvasTitle.innerHTML = _app.fileMeta('name');
				}
				break;
			case 'tracks_from_xml':
				var xLayer = _app.file.selectNodes('.//layer'),
					rMaster = [],
					xBrush,
					bStart,
					bLength,
					arr,
					fVal;
				for (i=0, kl=0, il=xLayer.length; i<il; i++) {
					kl = Math.max(kl, xLayer[i].getAttribute('length'));
				}
				for (i=0; i<kl; i++) rMaster.push([]);
				for (i=0, il=xLayer.length; i<il; i++) {
					xBrush = xLayer[i].selectNodes('./brush');
					for (j=0, jl=xBrush.length; j<jl; j++) {
						arr = JSON.parse(xBrush[j].getAttribute('value'));
						bStart = +xBrush[j].getAttribute('start');
						bLength = +xBrush[j].getAttribute('length');

						for (k=0; k<kl; k++) {
							fVal = (k>=bStart && k<bStart+bLength) ? arr[k-bStart] : false;
							rMaster[k].push(fVal);
						}
					}
				}
				//console.log( JSON.stringify(rMaster) );
				return rMaster;
			case 'save_file':
			case 'tracks_to_xml':
				var _fs       = _sys.fs,
					xFile     = _fs.createNode('file'),
					xAssets   = xFile.appendChild(_fs.createNode('assets')),
					assets    = _jr('li', _el.assetsList),
					xTimeline = xFile.appendChild(_fs.createNode('timeline')),
					tlLen     = Math.round(_el.frame_nob.offsetLeft / 16),
					lLayers   = _jr('li[data-track] > div', _el.tl_body_rows),
					meta      = {
						'mode'       : info.mode,
						'scale'      : info.scale,
						'origoX'     : info.origoX,
						'origoY'     : info.origoY,
						'frameIndex' : info.frameIndex
					},
					xMeta,
					xImage,
					assetEl,
					lBrush,
					rLayer,
					lBrushEl,
					rBrushEl,
					layerId,
					brushId,
					sbStart,
					sbLength,
					lColor,
					sxLayer,
					sxBrush,
					bArr;
				// save file meta
				for (assetEl in meta) {
					xMeta = xFile.appendChild(_fs.createNode('meta'));
					xMeta.setAttribute('name', assetEl);
					xMeta.setAttribute('value', meta[assetEl]);
				}
				// assets to xml
				for (i=0, il=assets.length; i<il; i++) {
					assetEl = _jr(assets[i]);
					aSrc = assetEl.find('figure').attr('style').match(/url\((.+?)\)/i)[1];
					
					xImage = xAssets.appendChild(_fs.createNode('image'));
					xImage.setAttribute('id', assetEl.attr('data-asset_id'));
					xImage.setAttribute('name', assetEl.find('span').html());
					xImage.setAttribute('source', aSrc);
				}
				// tracks to xml
				xTimeline.setAttribute('length', tlLen);
				for (i=0, il=lLayers.length; i<il; i++) {
					sxLayer = xTimeline.appendChild(_fs.createNode('layer'));

					lBrush  = _jr('.brushes li', lLayers[i].parentNode);
					layerId = lLayers[i].getAttribute('data-track_id');
					rLayer  = _jr('div[data-track_id="'+ layerId +'"]', _el.tl_content);
					lColor  = rLayer.likeClass('color_') || 'color_purple';

					sxLayer.setAttribute('id', layerId.slice('track_'.length));
					sxLayer.setAttribute('asset_id', lLayers[i].getAttribute('data-asset_id'));
					sxLayer.setAttribute('color', lColor.slice('color_'.length));
					sxLayer.setAttribute('start', Math.round(rLayer.left() / 16));
					sxLayer.setAttribute('length', Math.round(rLayer.width() / 16));
					
					for (j=0, jl=lBrush.length; j<jl; j++) {
						sxBrush = sxLayer.appendChild(_fs.createNode('brush'));
						// misc data
						lBrushEl = _jr(lBrush[j]);
						brushId  = lBrush[j].getAttribute('data-brush_id');
						rBrushEl = rLayer.parent().find('div[data-brush_id="'+ brushId +'"]');
						lColor   = rBrushEl.likeClass('color_') || 'color_purple';
						sbStart  = Math.round(rBrushEl.left() / 16);
						sbLength = Math.round(rBrushEl.width() / 16);
						// extract brush track
						for (bArr=[], k=sbStart, kl=sbStart+sbLength; k<kl; k++) {
							bArr.push(info.sequence[k][j]);
						}
						// save values to node
						sxBrush.setAttribute('id', brushId.slice('brush_'.length));
						if (lBrushEl.hasClass('is_hidden')) {
							sxBrush.setAttribute('hidden', 1);
						}
						sxBrush.setAttribute('name', lBrushEl.find('span').html());
						sxBrush.setAttribute('color', lColor.slice('color_'.length));
						sxBrush.setAttribute('start', sbStart);
						sxBrush.setAttribute('length', sbLength);
						sxBrush.setAttribute('value', JSON.stringify(bArr));
					}
				}
				console.log(xFile.xml.replace(/>/g, '>\n'));
				return xFile;
			case 'assets_loaded':
				// set workarea width + height
				info.width  = +_app.file.getAttribute('width');
				info.height = +_app.file.getAttribute('height');
				info.iX = (dim.w/2) - (info.width/2);
				info.iY = (dim.h/2) - (info.height/2);
				// remebered from when file is saved
				info.origoX = +_app.fileMeta('origoX') || 0;
				info.origoY = +_app.fileMeta('origoY') || 0;
				info.scale  = +_app.fileMeta('scale') || 1;
				if (info.scale > 1) self.zoom((info.scale-1) * 25, true);
				// arrayify tracks
				info.sequence = self.doEvent('tracks_from_xml');
				// set palette and visible channels
				info.palette = _app.timeline.doEvent('get_track_palette');
				info.visible = _app.timeline.doEvent('get_track_visible');
				// move timeline index
				info.frameIndex = parseInt(_app.fileMeta('frameIndex'), 10) || 0;
				// set application mode
				self.doEvent('mode_'+ (_app.fileMeta('mode') || 'design'));

				// temp
				//self.doEvent('tracks_to_xml');
				break;
			case 'nob_opacity':
				details = event.details;
				self.opacity(details.value);
				break;
			case 'nob_zoom':
				details = event.details;

				if (details.type === 'start') {
					scale = +details.value;
					self.zoomDetails = {
						origoX: info.origoX,
						origoY: info.origoY
					};
					if (scale > 0) {
						self.zoomDetails.percX = info.origoX / (self.cvs.width - (self.cvs.width * info.scale));
						self.zoomDetails.percY = info.origoY / (self.cvs.height - (self.cvs.height * info.scale));
						self.zoomDetails.origoX = 0;
						self.zoomDetails.origoY = 0;
					}
				}
				self.zoom( details.value );
				break;
			// native events
			case 'selectstart': return false;
			case 'mousedown':
				if (event.button === 2) return;
				if (isCircle) {
					if (event.metaKey || event.ctrlKey) {
						// BALL RESIZE
						self.mouseState = {
							type: 'resize',
							ballIndex: i,
							ballRadius: ballR,
							clickY: event.pageY
						};
						//doc.body.classList.add('cursor_hide');
						return false;
					}
					// BALL MOVE
					self.mouseState = {
						type: 'move',
						ballIndex: i,
						ballX: ballX - (info.iX * info.scale),
						ballY: ballY - (info.iY * info.scale)
					};
				} else {
					if (event.metaKey || event.ctrlKey) {
						// CANVAS ZOOM
						scale = +_el.nob_scale.getAttribute('data-value');
						
						if (scale === 0) {
							percX = ((mouseX - info.origoX) / self.cvs.width) * info.scale;
							percY = ((mouseY - info.origoY) / self.cvs.height) * info.scale;
							origoX = info.origoX / info.scale;
							origoY = info.origoY / info.scale;
						} else {
							percX = info.origoX / (self.cvs.width - (self.cvs.width * info.scale));
							percY = info.origoY / (self.cvs.height - (self.cvs.height * info.scale));
							origoX = 0;
							origoY = 0;
						}
						self.percX = percX;
						self.percY = percY;

						self.zoomEvents('focus');

						self.mouseState = {
							type: 'zoom',
							org_scale: scale,
							startY: mouseY,
							percX: percX,
							percY: percY,
							origoX: origoX,
							origoY: origoY
						};
					} else {
						// CANVAS PAN
						self.mouseState = {
							type: 'pan',
							origoX: info.origoX,
							origoY: info.origoY,
							clickX: mouseX,
							clickY: mouseY
						};
					}
				}
				//doc.body.classList.add('cursor_hide');
				break;
			case 'mousemove':
				if (!mouseState.type) {
					self.cvs.style.cursor = (event.metaKey)? '-webkit-zoom-in' : ((isCircle)? '-webkit-grab' : '');
					return;
				}

				switch (mouseState.type) {
					case 'pan':
						origoX = mouseX - mouseState.clickX + mouseState.origoX;
						origoY = mouseY - mouseState.clickY + mouseState.origoY;
						//info.origoX = Math.max(Math.min(origoX, img_half_width - cvs_half_width), -img_half_width - cvs_half_width);
						//info.origoY = Math.max(Math.min(origoY, img_half_height - cvs_half_height), -img_half_height - cvs_half_height);

						info.origoX = Math.min(origoX, 1/info.scale);
						info.origoY = Math.min(origoY, 1/info.scale);

						self.updateBallCvs();

						self.cvs.style.cursor = '-webkit-grabbing';
						break;
					case 'zoom':
						var val = Math.min(Math.max(mouseState.org_scale + (mouseState.startY - mouseY), 0), 100);
						self.zoom(val, true);

						info.origoX = ((self.cvs.width - (self.cvs.width * info.scale)) * self.percX) + mouseState.origoX;
						info.origoY = ((self.cvs.height - (self.cvs.height * info.scale)) * self.percY) + mouseState.origoY;
						
						self.updateBallCvs();
						
						self.cvs.style.cursor = '-webkit-zoom-in';
						break;
					case 'resize':
						var newRadius = parseFloat(((mouseState.ballRadius + (mouseState.clickY - event.pageY)) / info.scale).toFixed(2));
						frame[mouseState.ballIndex][2] = (newRadius < 2)? 2 : newRadius;

						self.cvs.style.cursor = '-webkit-zoom-in';
						break;
					case 'move':
						var bX = parseFloat(((mouseX + mouseState.ballX - info.origoX) / info.scale).toFixed(2)),
							bY = parseFloat(((mouseY + mouseState.ballY - info.origoY) / info.scale).toFixed(2));

						frame[mouseState.ballIndex][0] = bX;
						frame[mouseState.ballIndex][1] = bY;

						self.cvs.style.cursor = '-webkit-grabbing';
						break;
				}
				self.draw();
				break;
			case 'mouseup':
				if (!_sys.events.focusEl) self.zoomEvents('blur');

				self.zoomDetails =
				self.mouseState.type = false;
				self.cvs.style.cursor = '';
				//doc.body.classList.remove('cursor_hide');
				break;
		}
	},
	pi2: Math.PI*2,
	draw: function() {
		var _sys = sys,
			_app = _sys.app,
			file = _app.file,
			self = _app.canvas,
			info = self.info,
			cvs  = self.cvs,
			ctx  = self.ctx,
			ballCvs = self.ballCvs,
			ballCtx = self.ballCtx,
			pi2  = self.pi2,
			dim  = self.dim,

			sequence = info.sequence,
			frame = sequence[info.frameIndex],
			ball;
		
		ctx.fillStyle = '#636363';
		ctx.roundRect(0, 0, cvs.width, cvs.height, 4).fill();

		if (_app.type === 'image') {
			// semi-transparent box
			ctx.clearRect(  info.left-1,
							info.top-1,
							info.scaledWidth+2,
							info.scaledHeight+2);
			// disable image interpolation
			ctx.webkitImageSmoothingEnabled = false;

			if (info.mode === 'design') {
				// image
				ctx.drawImage(  info['1'].img,
								info.left,
								info.top,
								info.scaledWidth,
								info.scaledHeight);

				ctx.globalCompositeOperation = 'source-atop';
				ctx.drawImage(ballCvs, 0, 0);
				/*ctx.drawImageFromRect(
						ballCvs,
						0, 0,
						info.scaledWidth,
						info.scaledHeight,

						info.left,
						info.top,
						info.scaledWidth,
						info.scaledHeight
					);*/

				// current frame
				ctx.globalCompositeOperation = 'source-over';
				//ctx.fillStyle = 'rgba(255,0,255,0.4)';
				for (var k=0, kl=frame.length; k<kl; k++) {
					if (info.visible[k] !== 1) continue;
					ctx.fillStyle = info.palette[k].trans;

					ball = frame[k];
					ctx.beginPath();
					ctx.arc((info.iX + ball[0]) * info.scale + info.origoX,
							(info.iY + ball[1]) * info.scale + info.origoY,
							ball[2] * info.scale,
							0, pi2, false);
					ctx.fill();
				}
			} else {
				ctx.save();
				ctx.globalCompositeOperation = 'source-over';
				ctx.drawImage(ballCvs, 0, 0);
				// image
				ctx.globalCompositeOperation = 'source-in';
				ctx.drawImage(  info['1'].img,
								info.left,
								info.top,
								info.scaledWidth,
								info.scaledHeight);
				ctx.restore();
			}
			
			// canvas rectangle
			ctx.lineWidth = '0.25';
			ctx.strokeStyle = '#404040';
			ctx.strokeRect( info.left-2,
							info.top-2,
							info.scaledWidth+4,
							info.scaledHeight+4);
		}
		// trigger observer
		_sys.observer.trigger('zoom_pan');
	},
	updateBallCvs: function() {
		var _sys = sys,
			_app = _sys.app,
			file = _app.file,
			self = _app.canvas,
			info = self.info,
			ballCvs = self.ballCvs,
			ballCtx = self.ballCtx,
			sequence = info.sequence,
			frame = sequence[info.frameIndex],
			pi2  = self.pi2,
			ball;

		if (_app.type !== 'image') {

		}

		// some calculations
		info.left = (info.iX * info.scale) + info.origoX;
		info.top = (info.iY * info.scale) + info.origoY;
		info.scaledWidth = info.width * info.scale;
		info.scaledHeight = info.height * info.scale;
		// clear canvas
		ballCtx.clearRect(0, 0, ballCvs.width, ballCvs.height);
		// clip canvas
		ballCtx.save();
		ballCtx.beginPath();
		ballCtx.rect(info.left,
					info.top,
					info.scaledWidth,
					info.scaledHeight);
		ballCtx.clip();
		// draw balls
		for (var i=0, il=info.frameIndex; i<il; i++) {
			var prev_frame = sequence[i];
			for (var j=0, jl=prev_frame.length; j<jl; j++) {
				
				if (info.visible[j] !== 1 || !info.visible[j]) continue;
				ballCtx.fillStyle = info.palette[j].color;
				
				ball = prev_frame[j];
				ballCtx.beginPath();
				ballCtx.arc((info.iX + ball[0]) * info.scale + info.origoX,
							(info.iY + ball[1]) * info.scale + info.origoY,
							ball[2] * info.scale,
							0, pi2, false);
				ballCtx.fill();
			}
		}
		ballCtx.restore();
	},
	opacity: function(val) {
		var el = sys.el;
		el.nob_opacity.valEl.textContent = val;
		el.canvas_bg.style.opacity = 1 - (val/100);
	},
	zoom: function(val, update_nob) {
		var _sys = sys,
			el  = _sys.el,
			self = _sys.app.canvas,
			width  = self.cvs.width,
			height = self.cvs.height,
			zoomDetails = self.zoomDetails,
			percX  = 0.5,
			percY  = 0.5,
			origoX = 0,
			origoY = 0;
		// set info scale
		self.info.scale = +parseFloat((val / 25) + 1).toFixed(2);
		// update ui-value
		el.zoom_level.textContent = (self.info.scale * 100).toFixed();
		
		if (update_nob) {
			el.nob_scale.setAttribute('data-value', val);
			_sys.nobs.draw(el.nob_scale);
		} else {
			if (zoomDetails) {
				origoX = zoomDetails.origoX;
				origoY = zoomDetails.origoY;
				percX  = zoomDetails.percX || percX;
				percY  = zoomDetails.percY || percY;

				self.info.origoX = origoX + ((width - (width * self.info.scale)) * percX);
				self.info.origoY = origoY + ((height - (height * self.info.scale)) * percY);
			}
			self.updateBallCvs();
			self.draw();
		}
	},
	zoomEvents: function(type) {
		var el  = sys.el;
		switch (type) {
			case 'focus':
				jr(el.cvs_zoom)
					.css({'display': 'block'})
					.wait(1, function() {
						this.addClass('active');
					});
				break;
			case 'blur':
				jr(el.cvs_zoom)
					.removeClass('active')
					.wait(320, function() {
						this.css({'display': 'none'});
					});
				break;
		}
	}
};

/* jshint ignore:start */
/*
 		else {
			ctx.strokeStyle = '#555';
			ctx.lineWidth = 1;
			ctx.clearRect(240, 80, 270, 400);
			ctx.rect(240, 80, 270, 400);
			ctx.stroke();

			ctx.textBaseline = 'top';
			ctx.fillStyle = '#fff';
			ctx.textAlign = 'center';
			ctx.font = '200px '+ sys.app.font.info.family;

			//console.log( ctx.measureText(_app.assets.activeLetter) );
			//ctx.fillText('a', w/2, h/2 - 100);
			ctx.fillText(_app.assets.activeLetter, w/2, (h/2) - info.height);
		}
*/
/* jshint ignore:end */
