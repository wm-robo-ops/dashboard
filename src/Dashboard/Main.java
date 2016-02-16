package Dashboard;

import java.io.IOException;

import javax.swing.JFrame;
import Dashboard.VideoStreamPlayer;
import Dashboard.MapPanel;

public class Main extends JFrame {
    
    private static final long serialVersionUID = 1L;

    public static void main(String[]  args) {
        VideoStreamPlayer vsp = new VideoStreamPlayer();
        String[] arg = {"C:\\Users\\djruh_000\\Desktop\\Computer_Science\\robo-ops\\stock.mp4"};
        try {
            vsp.init(arg);
        }
        catch (InterruptedException e) { e.printStackTrace();}
        catch (IOException e) { e.printStackTrace(); }
    }

}
